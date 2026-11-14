#!/usr/bin/env python3
"""macmini 可用模型清单的校验 / 连通测试。

2026-11-12 用户立：
  - macmini 上默认只用 magpie 的免费模型；
  - 可用模型清单由用户动态维护：2026-11-12 为 hy4free 与 deepseek-v4.1-flash-1017，
    2026-11-13 用户又授权加入 hy4std（标准计费通道，消耗 WorkBuddy Free plan 的 credits）。

用法：
  python3 ~/.pi/agent/patch/macmini-models/check.py           # 校验清单格式并打印
  python3 ~/.pi/agent/patch/macmini-models/check.py --ping    # 另外在 macmini 上逐个实测可用性

改清单：直接编辑 allowlist.json（守卫实时读取，无需重启会话）。
"""

import json
import subprocess
import sys
from pathlib import Path

ALLOWLIST = Path.home() / ".pi/agent/patch/macmini-models/allowlist.json"
REMOTE = "mac-mini"
PI = "/Users/mac/.local/node/bin/pi"


def load() -> list[dict]:
    try:
        data = json.loads(ALLOWLIST.read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"❌ 清单文件不存在：{ALLOWLIST}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ 清单不是合法 JSON：{e}")
        sys.exit(1)
    models = data.get("models")
    if not isinstance(models, list) or not models:
        print("❌ 清单缺少非空的 models 数组")
        sys.exit(1)
    bad = [m for m in models if not isinstance(m, dict) or not str(m.get("model", "")).strip()]
    if bad:
        print(f"❌ 有 {len(bad)} 个条目缺少 model 字段：{bad}")
        sys.exit(1)
    return models


def load_fallback() -> dict | None:
    """读 fallback 字段（可选）。有就校验 model 非空，没写就返回 None。"""
    try:
        data = json.loads(ALLOWLIST.read_text(encoding="utf-8"))
    except Exception:
        return None
    fb = data.get("fallback")
    if not isinstance(fb, dict):
        return None
    model = str(fb.get("model") or "").strip()
    if not model:
        print("❌ fallback 字段缺少 model")
        sys.exit(1)
    thinking = fb.get("thinking")
    if thinking is not None and not isinstance(thinking, str):
        print("❌ fallback.thinking 必须是字符串（如 max）")
        sys.exit(1)
    return fb


def ping(model: str) -> bool:
    cmd = f"{PI} -p 'Reply with exactly: PING-OK' --model {model}"
    try:
        r = subprocess.run(
            ["ssh", REMOTE, f"cd /tmp && {cmd}"],
            capture_output=True, text=True, timeout=180,
        )
        out = (r.stdout or "").strip()
        ok = "PING-OK" in out
        print(f"  {'✅' if ok else '❌'} {model}  (exit={r.returncode})")
        if not ok:
            tail = (out or (r.stderr or "").strip())[-300:]
            print(f"     输出：{tail}")
        return ok
    except subprocess.TimeoutExpired:
        print(f"  ❌ {model}  （超时 180s）")
        return False
    except Exception as e:
        print(f"  ❌ {model}  （{e}）")
        return False


def main() -> None:
    models = load()
    print(f"清单：{ALLOWLIST}")
    print(f"条目：{len(models)} 个")
    for m in models:
        print(f"  - {m['model']}  ({m.get('display', '')})")
    fb = load_fallback()
    if fb:
        state = "启用" if fb.get("enabled", True) else "停用"
        print(f"\n兜底（{state}）：{fb['model']}  思考等级 {fb.get('thinking') or '(未设)'}")
        print("（清单内模型全部没额度时才走兜底；判定与选择器：python3 pick.py）")
    else:
        print("\n（没有 fallback 字段：清单内模型全没额度时无模型可用，只能向用户汇报）")
    if "--ping" in sys.argv:
        print("\nmacmini 实测（经 magpie 隧道）：")
        results = [ping(m["model"]) for m in models]
        if not all(results):
            print("\n❌ 有模型不可用：先跑 `bash ~/.pi/agent/patch/magpie-tunnel/install.sh --status` 查隧道 / magpie，再向用户汇报原因。")
            sys.exit(1)
        print("\n✅ 清单内模型全部可用")
    else:
        print("\n✅ 清单格式正确（加 --ping 可实测）")


if __name__ == "__main__":
    main()