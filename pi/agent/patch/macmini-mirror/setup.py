#!/usr/bin/env python3
"""配置本机 ↔ macmini 的 Syncthing 双向镜像（幂等）。

用法：python3 setup.py
- 本机（MacBook Air，arm64）与 macmini（Intel，x64）各跑一个 Syncthing 守护进程；
- 三个共享目录：~/.pi/agent（全局能力层）、~/.dev/private（私有本体）、
  ~/.dsh（DSH 权威源，本机 sendonly → macmini receiveonly）；
- 排除项写在各自目录根的 .stignore（见同目录 stignore-* 模板）。

说明：本脚本只负责「建配置」，不改已存在目录的设置（幂等，可重复执行）。
"""
import json
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path

LOCAL = "http://127.0.0.1:8384"
REMOTE_HOST = "mac-mini"
LOCAL_IP = "192.168.1.102"
REMOTE_IP = "192.168.1.101"
HOME = Path.home()


def local_key():
    cfg = HOME / "Library/Application Support/Syncthing/config.xml"
    text = cfg.read_text()
    start = text.index("<apikey>") + len("<apikey>")
    return text[start:text.index("<", start)]


def remote_key():
    out = subprocess.run(
        ["ssh", REMOTE_HOST,
         "grep -o '<apikey>[^<]*' \"$HOME/Library/Application Support/Syncthing/config.xml\" | cut -d'>' -f2"],
        capture_output=True, text=True, check=True)
    return out.stdout.strip()


def api(base, key, method, path, payload=None, remote=False):
    body = json.dumps(payload).encode() if payload is not None else None
    url = f"{base}/rest{path}"
    if remote:
        cmd = ["ssh", REMOTE_HOST,
               f"curl -s -X {method} -H 'X-API-Key: {key}' "
               f"-H 'Content-Type: application/json' --data-binary @- {url}"]
        out = subprocess.run(cmd, input=body or b"", capture_output=True, check=True)
        data = out.stdout
    else:
        req = urllib.request.Request(url, data=body, method=method)
        req.add_header("X-API-Key", key)
        if body:
            req.add_header("Content-Type", "application/json")
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
    if not data.strip():
        return None
    try:
        return json.loads(data)
    except json.JSONDecodeError:
        return data.decode()


def ensure_device(base, key, device_id, name, addr, remote):
    devices = api(base, key, "GET", "/config/devices", remote=remote)
    if any(d["deviceID"] == device_id for d in devices):
        print(f"  device {name} 已存在")
        return
    payload = {
        "deviceID": device_id, "name": name,
        "addresses": ["dynamic", addr],
        "compression": "metadata", "paused": False,
    }
    api(base, key, "POST", "/config/devices", payload, remote=remote)
    print(f"  device {name} 已添加")


def ensure_folder(base, key, folder, remote):
    folders = api(base, key, "GET", "/config/folders", remote=remote)
    if any(f["id"] == folder["id"] for f in folders):
        print(f"  folder {folder['id']} 已存在")
        return
    api(base, key, "POST", "/config/folders", folder, remote=remote)
    print(f"  folder {folder['id']} 已添加")


def folder_spec(fid, label, path, device_ids, versions_path, folder_type="sendreceive"):
    return {
        "id": fid,
        "label": label,
        "filesystemType": "basic",
        "path": path,
        "type": folder_type,
        "devices": [{"deviceID": d, "introducedBy": "", "encryptionPassword": ""} for d in device_ids],
        "rescanIntervalS": 600,
        "fsWatcherEnabled": True,
        "fsWatcherDelayS": 3,
        "ignorePerms": False,
        "autoNormalize": True,
        "paused": False,
        "maxConflicts": 10,
        "versioning": {
            "type": "staggered",
            "params": {"cleanupIntervalS": "3600", "maxAgeS": "2592000"},
            "cleanupIntervalS": 3600,
            "fsPath": versions_path,
            "fsType": "basic",
        },
    }


def ensure_stignore(path, template, remote=False):
    """确保 .stignore 在 folder 启动前就位，避免先把凭证/会话同步过去。"""
    if remote:
        r = subprocess.run(["ssh", REMOTE_HOST, f"test -f {path}/.stignore"], capture_output=True)
        if r.returncode == 0:
            return
        subprocess.run(["ssh", REMOTE_HOST, f"mkdir -p {path}"], check=True)
        subprocess.run(["scp", str(template), f"{REMOTE_HOST}:{path}/.stignore"], check=True)
        print(f"  .stignore 已放到 {path}")
        return
    p = Path(path)
    p.mkdir(parents=True, exist_ok=True)
    dst = p / ".stignore"
    if not dst.exists():
        shutil.copy(template, dst)
        print(f"  .stignore 已放到 {path}")


def drop_folder(base, key, fid, remote):
    """从配置里移除某个共享目录（只停同步，磁盘文件一律保留）。

    走 `DELETE /rest/config/folders/<id>`：精确、不用整份配置回写。
    注意必须复用 `api()`，它会把 remote=True 的请求经 ssh + curl 打到 macmini 的
    127.0.0.1:8384——直接用 urllib 打本机端点、却带对端 API key，会得到 403
    （2026-11-05 踩过）。
    """
    try:
        api(base, key, "DELETE", f"/config/folders/{fid}", remote=remote)
        print(f"  [del ] {fid} 已从配置移除（磁盘文件保留）")
    except Exception as e:  # noqa: BLE001
        msg = str(e)
        if "No folder with given ID" in msg or "404" in msg:
            print(f"  [skip] {fid} 不存在")
        else:
            raise


def main():
    drop_dev = "--drop-developer" in sys.argv
    with_dev = "--with-developer" in sys.argv
    lk = local_key()
    rk = remote_key()
    lid = api(LOCAL, lk, "GET", "/system/status")["myID"]
    rid = api(LOCAL, rk, "GET", "/system/status", remote=True)["myID"]
    print(f"local id:  {lid}\nremote id: {rid}")

    print("== 本机 ==")
    ensure_device(LOCAL, lk, rid, "Macs-Mac-mini", f"tcp://{REMOTE_IP}:22000", False)
    stignore_dsh = Path(__file__).with_name("stignore-dsh")
    ensure_stignore("/Users/xhq/.dsh", stignore_dsh)
    if with_dev:  # 2026-11-05 起代码走 GitHub，只有显式 --with-developer 才重建这层同步
        ensure_folder(LOCAL, lk, folder_spec(
            "developer", "Developer (team mirror)", "/Users/xhq/Developer",
            [lid, rid], "/Users/xhq/.syncthing-versions/developer"), False)
    ensure_folder(LOCAL, lk, folder_spec(
        "pi-agent", "pi agent (team mirror)", "/Users/xhq/.pi/agent",
        [lid, rid], "/Users/xhq/.syncthing-versions/pi-agent"), False)
    ensure_folder(LOCAL, lk, folder_spec(
        "private", "私有内容本体（~/.dev/private）", "/Users/xhq/.dev/private",
        [lid, rid], "/Users/xhq/.syncthing-versions/private"), False)
    ensure_folder(LOCAL, lk, folder_spec(
        "dsh", "DSH home (MacBook authoritative)", "/Users/xhq/.dsh",
        [lid, rid], "/Users/xhq/.syncthing-versions/dsh", "sendonly"), False)

    print("== macmini ==")
    ensure_device(LOCAL, rk, lid, "MacBook-Air-xhq", f"tcp://{LOCAL_IP}:22000", True)
    ensure_stignore("/Users/mac/.dsh", stignore_dsh, remote=True)
    if with_dev:
        ensure_folder(LOCAL, rk, folder_spec(
            "developer", "Developer (team mirror)", "/Users/mac/Developer",
            [rid, lid], "/Users/mac/.syncthing-versions/developer"), True)
    ensure_folder(LOCAL, rk, folder_spec(
        "pi-agent", "pi agent (team mirror)", "/Users/mac/.pi/agent",
        [rid, lid], "/Users/mac/.syncthing-versions/pi-agent"), True)
    ensure_folder(LOCAL, rk, folder_spec(
        "private", "私有内容本体（~/.dev/private）", "/Users/mac/.dev/private",
        [rid, lid], "/Users/mac/.syncthing-versions/private"), True)
    ensure_folder(LOCAL, rk, folder_spec(
        "dsh", "DSH home (MacBook authoritative)", "/Users/mac/.dsh",
        [rid, lid], "/Users/mac/.syncthing-versions/dsh", "receiveonly"), True)

    if drop_dev:
        print("== 移除 developer 共享（代码改走 GitHub）==")
        drop_folder(LOCAL, lk, "developer", False)
        drop_folder(LOCAL, rk, "developer", True)
    print("== 完成 ==")


if __name__ == "__main__":
    sys.exit(main())
