#!/usr/bin/env python3
"""受保护共享目录的「改前快照」工具（飞书云盘 + 本地各留 5 份）

保护的目录
----------
  1) ~/.pi/agent          全局能力层（规则 / skills / extensions / patch / docs …）
  2) ~/.dev/private       各项目的私有内容本体（由项目里的软链接指过来）

为什么需要
----------
这两个目录现在允许 macmini 直接改删（不再受「远端递归删除一律拒绝」的限制），
但它们是全队最不可重建的东西：误删一次就是永久损失。所以规矩是「改之前先快照」。

机制
----
  * 快照 = tar.gz，命名 <target>-<YYYYMMDD-HHMMSS>.tar.gz
  * 本地留 ~/.dev/snapshots/ 最近 5 份；飞书云盘 <根备份文件夹>/dev-snapshots/<target>/ 留最近 5 份
  * 成功后写令牌到 ~/.dev/private/.state/snapshot-token.json（这个文件随 Syncthing 同步，
    所以「本机做的快照，macmini 也认」）
  * 令牌里的 tree hash = 当前内容指纹：内容没变过 → 不必重复上传；内容变了 → 旧令牌失效，
    必须重新快照才允许改动（这就是「改前快照」强制点）
  * 快照失败不写令牌 → 后续改动继续被挡（宁可不改，也不要「以为备份了其实没有」）

用法
----
  dev-snapshots.py snapshot [pi-agent|private|both] [--force]
  dev-snapshots.py check    [pi-agent|private|both]        # 0=令牌有效, 1=需要快照
  dev-snapshots.py list
  dev-snapshots.py restore  <target> [--name <文件名>]      # 默认取最新一份
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tarfile
import time
from pathlib import Path

HOME = Path.home()
PRIVATE = HOME / ".dev" / "private"
SNAP_LOCAL = HOME / ".dev" / "snapshots"
TOKEN_FILE = PRIVATE / ".state" / "snapshot-token.json"
ENDPOINTS = HOME / ".pi" / "agent" / "skills" / "backup" / "endpoints" / "endpoints.json"

KEEP = 5
TS_FMT = "%Y%m%d-%H%M%S"

# 全局能力层要打包的部分（运行时数据 / 二进制 / 会话记录一律排除）
PI_AGENT_INCLUDES = [
    "AGENTS.md",
    "settings.json",
    "mcp-adapter.json",
    "skills",
    "docs",
    "patch",
    "extensions",
    "prompts",
    "themes",
]
PI_AGENT_EXCLUDES = [
    "state/",
    "sessions/",
    "logs/",
    "tmp/",
    "intercom/",
    "npm/",
    "bin/",
    "models-store.json",
    "mcp-cache.json",
    "mcp-npx-cache.json",
    "mcp-last-seen-version.json",
    "trust.json",
    "mcp-project-approvals.json",
    # 以下几条是「各机各自维护」的本机配置：Syncthing 不同步（见 .stignore），
    # 不排除的话两台机器算出的内容指纹会不同、且会把本机路径写进公开备份。
    "skills/anysearch/runtime.conf",
    "patch/session-link/config.json",
    "patch/session-link/local-links.json",
    "patch/session-link/chain-registry.json",
    "*.log",
    "*.lock",
    "__pycache__/",
    "*.pyc",
    ".DS_Store",
    "*.sync-conflict-*",
    ".stversions/",
]

TARGETS = {
    "pi-agent": {"root": HOME / ".pi" / "agent", "kind": "include"},
    "private": {"root": PRIVATE, "kind": "whole"},
}

TAR_NAME_RE = re.compile(r"^(pi-agent|private)-\d{8}-\d{6}\.tar\.gz(\.enc)?$")

# 云端加密（2026-11-09 用户要求）：private 快照里有交易凭证等敏感数据，
# 不再明文传飞书云盘——上传前 AES-256 加密，密钥存 macOS Keychain。
ENC_SUFFIX = ".enc"
KEYCHAIN_SERVICE = "pi-dev-snapshots"
KEYCHAIN_ACCOUNT = "encryption-key"


def _lark_bin() -> str:
    """定位 lark-cli：非交互 shell（如 ssh 直接执行）的 PATH 里常常没有 ~/.local/bin。"""
    candidates = [
        shutil.which("lark-cli"),
        str(HOME / ".local" / "bin" / "lark-cli"),
        str(HOME / "bin" / "lark-cli"),
        "/opt/homebrew/bin/lark-cli",
        "/usr/local/bin/lark-cli",
    ]
    for cand in candidates:
        if cand and Path(cand).exists():
            return cand
    return "lark-cli"


LARK = _lark_bin()


# ----------------------------------------------------------------- 基础


def sh(cmd: list[str], **kw) -> subprocess.CompletedProcess:
    env = dict(os.environ)
    env["NO_PROXY"] = "feishu.cn,.feishu.cn,larksuite.com,.larksuite.com,127.0.0.1,localhost"
    env.pop("HTTP_PROXY", None)
    env.pop("HTTPS_PROXY", None)
    env.pop("ALL_PROXY", None)
    env.pop("http_proxy", None)
    env.pop("https_proxy", None)
    env.pop("all_proxy", None)
    return subprocess.run(cmd, capture_output=True, text=True, env=env, **kw)


def tree_hash(target: str) -> str:
    """内容指纹：路径 + mtime + 大小（不读内容，快；足够判断「有没有变过」）。"""
    spec = TARGETS[target]
    root: Path = spec["root"]
    h = hashlib.sha256()
    if spec["kind"] == "include":
        files: list[Path] = []
        for inc in PI_AGENT_INCLUDES:
            p = root / inc
            if p.is_file():
                files.append(p)
            elif p.is_dir():
                files.extend(
                    f for f in p.rglob("*")
                    if f.is_file() and not _pi_agent_excluded(f.relative_to(root))
                )
    else:
        files = [
            f for f in root.rglob("*")
            if f.is_file() and not _private_excluded(f.relative_to(root))
        ]
    for f in sorted(files):
        st = f.lstat()
        h.update(f"{f.relative_to(root)}:{int(st.st_mtime)}:{st.st_size}\n".encode())
    return h.hexdigest()[:16]


def _pi_agent_excluded(rel: Path) -> bool:
    s = str(rel) + ("/" if rel.is_dir() else "")
    for pat in PI_AGENT_EXCLUDES:
        if pat.endswith("/"):
            if f"/{s}".find("/" + pat) >= 0 or s.startswith(pat):
                return True
        elif pat.startswith("*."):
            if s.endswith(pat[1:]):
                return True
        elif "sync-conflict" in pat:
            if pat.strip("*") in s:
                return True
        elif s == pat or s.startswith(pat + "/"):
            return True
    return False


def _private_excluded(rel: Path) -> bool:
    """排除「每台机器各自不同、或本身是同步元数据」的路径。

    `.stignore` / `.stfolder` 是 Syncthing 的本机配置（不会被同步），两台机器的
    mtime / 存在性不一样——不排除的话，同一份内容在两台机器上算出的内容指纹不同，
    「任一侧做的快照另一侧也认」就失效了。
    """
    s = str(rel)
    return (
        s.startswith(".state")
        or s.startswith(".stignore")
        or s.startswith(".stfolder")
        or "/node_modules/" in s
        or s.startswith("node_modules/")
        or s.endswith(".DS_Store")
        or "/.DS_Store" in s
        or "sync-conflict" in s
    )


def load_token() -> dict:
    if TOKEN_FILE.exists():
        try:
            return json.loads(TOKEN_FILE.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def save_token(data: dict) -> None:
    TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)
    TOKEN_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def token_valid(target: str, data: dict | None = None, fresh_min: int = 0) -> tuple[bool, str]:
    """fresh_min > 0 时放宽为「N 分钟内的快照也算有效」（供 snapshot-guard 用）。"""
    data = load_token() if data is None else data
    rec = data.get(target) or {}
    if not rec:
        return False, "没有快照记录"
    cur = tree_hash(target)
    if rec.get("hash") == cur:
        return True, f"快照有效（{rec.get('time')}，{rec.get('remote') or rec.get('local')}）"
    if fresh_min > 0 and rec.get("time"):
        try:
            age = (time.time() - time.mktime(time.strptime(rec["time"], "%Y-%m-%d %H:%M:%S"))) / 60
        except ValueError:
            age = 1e9
        if 0 <= age <= fresh_min:
            return True, f"快照在 {age:.0f} 分钟内（内容已变，允许小幅改动；大改请重新快照）"
    return False, f"内容已变化（快照 hash={rec.get('hash')}，当前={cur}）"


# ----------------------------------------------------------------- 飞书


def feishu_root_token() -> str:
    if not ENDPOINTS.exists():
        raise SystemExit(f"[ERR] 找不到端点注册表：{ENDPOINTS}")
    data = json.loads(ENDPOINTS.read_text(encoding="utf-8"))
    for ep in data.get("endpoints", []):
        if ep.get("type") == "builtin-lark-cli" and ep.get("root_folder_token"):
            return ep["root_folder_token"]
    raise SystemExit("[ERR] 注册表里没有已授权的 builtin-lark-cli 端点（root_folder_token 缺失）")


def feishu_list(folder: str) -> list[dict]:
    out = sh([LARK, "drive", "files", "list", "--folder-token", folder,
              "--as", "user", "--format", "json"])
    try:
        j = json.loads(out.stdout)
    except Exception:
        raise SystemExit(f"[ERR] 飞书 list 解析失败：{out.stdout[:200]} {out.stderr[:200]}")
    if not j.get("ok"):
        raise SystemExit(f"[ERR] 飞书 list 失败：{out.stdout[:300]}")
    return (j.get("data") or {}).get("files") or []


def feishu_ensure_folder(parent: str, name: str) -> str:
    for f in feishu_list(parent):
        if f.get("name") == name and f.get("type") == "folder":
            return f["token"]
    out = sh([LARK, "drive", "+create-folder", "--name", name,
              "--folder-token", parent, "--as", "user"])
    tok = _find_token(out.stdout)
    if not tok:
        raise SystemExit(f"[ERR] 创建飞书文件夹失败：{out.stdout[:300]} {out.stderr[:300]}")
    return tok


def _find_token(text: str) -> str | None:
    try:
        j = json.loads(text)
    except Exception:
        m = re.search(r'"token"\s*:\s*"([A-Za-z0-9]+)"', text)
        return m.group(1) if m else None
    for key in ("token", "file_token", "folder_token"):
        if isinstance(j.get(key), str):
            return j[key]
    for v in j.values():
        if isinstance(v, dict):
            t = _find_token(json.dumps(v))
            if t:
                return t
    return None


def snapshot_key() -> str:
    """从 Keychain 取快照加密口令；没有就生成一个并存入（首次）。

    重要：这把口令丢了，云端加密备份就恢复了了。首次生成后请自己另存一份
    （比如放进密码库），轮换需同时处理云端旧快照。
    """
    r = sh(["security", "find-generic-password", "-s", KEYCHAIN_SERVICE,
            "-a", KEYCHAIN_ACCOUNT, "-w"], check=False)
    if r.returncode == 0 and r.stdout.strip():
        return r.stdout.strip()
    key = base64.b64encode(os.urandom(32)).decode()
    sh(["security", "add-generic-password", "-s", KEYCHAIN_SERVICE,
        "-a", KEYCHAIN_ACCOUNT, "-w", key, "-U"])
    print("  [NEW] 已生成快照加密口令并存进 Keychain（请自行另存一份，丢了云端备份就废了）")
    return key


def encrypt_archive(arch: Path) -> Path:
    """加密快照包（口令经 stdin 传入，不出现在进程列表里）。"""
    enc = arch.with_name(arch.name + ENC_SUFFIX)
    r = subprocess.run(
        ["openssl", "enc", "-aes-256-cbc", "-pbkdf2", "-salt",
         "-in", str(arch), "-out", str(enc), "-pass", "stdin"],
        input=snapshot_key() + "\n", text=True, capture_output=True,
    )
    if r.returncode != 0:
        raise SystemExit(f"[ERR] 加密失败：{r.stderr[:200]}")
    return enc


def decrypt_archive(enc: Path) -> Path:
    """解密下载到的快照包（.enc → .tar.gz）。"""
    out = enc.with_name(enc.name[: -len(ENC_SUFFIX)])
    r = subprocess.run(
        ["openssl", "enc", "-d", "-aes-256-cbc", "-pbkdf2",
         "-in", str(enc), "-out", str(out), "-pass", "stdin"],
        input=snapshot_key() + "\n", text=True, capture_output=True,
    )
    if r.returncode != 0:
        raise SystemExit(f"[ERR] 解密失败（Keychain 里的口令不对？）：{r.stderr[:200]}")
    return out


def feishu_upload(local: Path, folder: str) -> bool:
    out = sh([LARK, "drive", "+upload", "--file", f"./{local.name}",
              "--folder-token", folder, "--as", "user"], cwd=str(local.parent))
    return '"ok": true' in out.stdout or '"ok":true' in out.stdout


def feishu_delete(file_token: str) -> bool:
    out = sh([LARK, "drive", "+delete", "--file-token", file_token,
              "--type", "file", "--as", "user", "--yes"])
    return '"ok": true' in out.stdout or '"ok":true' in out.stdout


def prune_remote(folder: str, target: str, keep: int = KEEP) -> int:
    files = [f for f in feishu_list(folder)
             if f.get("type") == "file" and TAR_NAME_RE.match(f.get("name", ""))
             and f["name"].startswith(target + "-")]
    files.sort(key=lambda f: f["name"], reverse=True)
    removed = 0
    for f in files[keep:]:
        if feishu_delete(f["token"]):
            removed += 1
            print(f"  [DEL] 云端旧快照 {f['name']}")
        else:
            print(f"  [WARN] 删除失败（需人工处理）：{f['name']} {f['token']}")
    # 删除是静默失败的高发区：删完必须复核
    left = [f for f in feishu_list(folder) if TAR_NAME_RE.match(f.get("name", ""))
            and f["name"].startswith(target + "-")]
    if len(left) > keep:
        raise SystemExit(f"[ERR] 云端保留份数异常：{len(left)} > {keep}")
    return removed


# ----------------------------------------------------------------- 打包


def build_archive(target: str) -> Path:
    SNAP_LOCAL.mkdir(parents=True, exist_ok=True)
    spec = TARGETS[target]
    root: Path = spec["root"]
    if not root.exists():
        raise SystemExit(f"[ERR] 目标目录不存在：{root}")
    name = f"{target}-{time.strftime(TS_FMT)}.tar.gz"
    out = SNAP_LOCAL / name
    if spec["kind"] == "include":
        excl = SNAP_LOCAL / f".exclude-{target}.txt"
        excl.write_text("\n".join(PI_AGENT_EXCLUDES), encoding="utf-8")
        includes = [i for i in PI_AGENT_INCLUDES if (root / i).exists()]
        cmd = ["tar", "-czf", str(out), "-C", str(root), "-X", str(excl), *includes]
        r = sh(cmd)
        if r.returncode != 0:
            raise SystemExit(f"[ERR] 打包失败：{r.stderr[:300]}")
    else:
        with tarfile.open(out, "w:gz") as tf:
            for f in sorted(root.rglob("*")):
                rel = f.relative_to(root)
                if _private_excluded(rel):
                    continue
                tf.add(f, arcname=str(rel), recursive=False)
    return out


def prune_local(target: str, keep: int = KEEP) -> None:
    files = sorted(
        [p for p in SNAP_LOCAL.glob(f"{target}-*.tar.gz") if TAR_NAME_RE.match(p.name)],
        key=lambda p: p.name,
        reverse=True,
    )
    for p in files[keep:]:
        p.unlink(missing_ok=True)
        print(f"  [DEL] 本地旧快照 {p.name}")


# ----------------------------------------------------------------- 子命令


def cmd_snapshot(args) -> int:
    targets = ["pi-agent", "private"] if args.target == "both" else [args.target]
    data = load_token()
    rc = 0
    for target in targets:
        ok, why = token_valid(target, data)
        if ok and not args.force:
            print(f"[SKIP] {target}：{why}")
            continue
        print(f"[SNAP] {target}：打包…")
        arch = build_archive(target)
        size = arch.stat().st_size
        print(f"  [OK] 本地 {arch.name}（{size / 1048576:.1f} MB）")
        remote_ok = False
        try:
            root_tok = feishu_root_token()
            dev_tok = feishu_ensure_folder(root_tok, "dev-snapshots")
            target_tok = feishu_ensure_folder(dev_tok, target)
            print(f"  [UP ] 上传到飞书 dev-snapshots/{target}/（AES-256 加密）…")
            enc = encrypt_archive(arch)
            remote_ok = feishu_upload(enc, target_tok)
            enc.unlink(missing_ok=True)
            if not remote_ok:
                raise SystemExit("[ERR] 上传失败")
            print("  [OK] 云端上传完成")
            prune_remote(target_tok, target)
        except SystemExit as e:
            print(f"  {e}")
            remote_ok = False
        prune_local(target)
        if not remote_ok:
            # 关键：没上传成功就不写令牌 → 后续改动继续被挡
            data.pop(target, None)
            save_token(data)
            print(f"[FAIL] {target}：云端快照失败，未签发令牌（改动会被守卫拦下）")
            rc = 1
            continue
        data[target] = {
            "time": time.strftime("%Y-%m-%d %H:%M:%S"),
            "hash": tree_hash(target),
            "local": arch.name,
            "remote": f"dev-snapshots/{target}/{arch.name}",
        }
        save_token(data)
        print(f"[DONE] {target}：快照完成，令牌已签发")
    return rc


def cmd_check(args) -> int:
    targets = ["pi-agent", "private"] if args.target == "both" else [args.target]
    data = load_token()
    rc = 0
    for target in targets:
        ok, why = token_valid(target, data, fresh_min=args.fresh_min)
        print(f"{'[OK]  ' if ok else '[NEED]'} {target}：{why}")
        if not ok:
            rc = 1
    return rc


def cmd_list(args) -> int:
    print("== 本地快照（~/.dev/snapshots）")
    for p in sorted(SNAP_LOCAL.glob("*.tar.gz")):
        print(f"  {p.name:<40} {p.stat().st_size / 1048576:>7.1f} MB")
    try:
        root_tok = feishu_root_token()
        dev = [f for f in feishu_list(root_tok) if f.get("name") == "dev-snapshots" and f.get("type") == "folder"]
        if not dev:
            print("== 云端：还没有 dev-snapshots 文件夹")
            return 0
        for target in TARGETS:
            folders = [f for f in feishu_list(dev[0]["token"])
                       if f.get("name") == target and f.get("type") == "folder"]
            if not folders:
                continue
            print(f"== 云端 dev-snapshots/{target}")
            for f in sorted(feishu_list(folders[0]["token"]), key=lambda x: x.get("name", ""), reverse=True):
                if f.get("type") == "file":
                    print(f"  {f['name']:<40} {f.get('token')}")
    except SystemExit as e:
        print(e)
        return 1
    return 0


def cmd_restore(args) -> int:
    target = args.target
    data = load_token()
    rec = data.get(target) or {}
    name = args.name or (Path(rec.get("local", "")).name if rec.get("local") else None)
    local = SNAP_LOCAL / name if name else None

    # 恢复前先给现状留一份，避免「恢复把现状也冲掉」
    print("[GUARD] 恢复前先快照当前状态…")
    subprocess.run([sys.executable, __file__, "snapshot", target, "--force"])

    if not local or not local.exists():
        print(f"[INFO] 本地没有 {name}，从飞书下载…")
        root_tok = feishu_root_token()
        dev_tok = feishu_ensure_folder(root_tok, "dev-snapshots")
        target_tok = feishu_ensure_folder(dev_tok, target)
        files = [f for f in feishu_list(target_tok)
                 if f.get("type") == "file" and TAR_NAME_RE.match(f.get("name", ""))]
        if not files:
            print("[ERR] 云端没有任何快照")
            return 1
        files.sort(key=lambda f: f["name"], reverse=True)
        pick = next((f for f in files if f["name"] == name), files[0]) if name else files[0]
        SNAP_LOCAL.mkdir(parents=True, exist_ok=True)
        out = sh([LARK, "drive", "+download", "--file-token", pick["token"],
                  "--output", f"./{pick['name']}", "--as", "user"], cwd=str(SNAP_LOCAL))
        if not (SNAP_LOCAL / pick["name"]).exists():
            print(f"[ERR] 下载失败：{out.stdout[:200]} {out.stderr[:200]}")
            return 1
        local = SNAP_LOCAL / pick["name"]
        if local.name.endswith(ENC_SUFFIX):
            print("[INFO] 云端快照是加密的，先解密…")
            local = decrypt_archive(local)
    print(f"[RESTORE] {local} -> {TARGETS[target]['root']}")
    if args.dry_run:
        return 0
    root = TARGETS[target]["root"]
    with tarfile.open(local, "r:gz") as tf:
        tf.extractall(root)
    print("[DONE] 恢复完成（注意：不会删除多出来的文件，需要清理请手工核对）")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="受保护共享目录的改前快照")
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("snapshot")
    p.add_argument("target", nargs="?", default="both",
                   choices=["pi-agent", "private", "both"])
    p.add_argument("--force", action="store_true", help="内容没变也重新打包上传")
    p.set_defaults(func=cmd_snapshot)

    p = sub.add_parser("check")
    p.add_argument("target", nargs="?", default="both",
                   choices=["pi-agent", "private", "both"])
    p.add_argument("--fresh-min", type=int, default=0,
                   help="放宽为「N 分钟内的快照也算有效」（默认 0 = 必须与当前内容一致）")
    p.set_defaults(func=cmd_check)

    p = sub.add_parser("list")
    p.set_defaults(func=cmd_list)

    p = sub.add_parser("restore")
    p.add_argument("target", choices=["pi-agent", "private"])
    p.add_argument("--name")
    p.add_argument("--dry-run", action="store_true")
    p.set_defaults(func=cmd_restore)

    args = ap.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
