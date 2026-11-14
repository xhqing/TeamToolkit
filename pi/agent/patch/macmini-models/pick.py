#!/usr/bin/env python3
"""macmini 模型选择：清单内挑一个还有额度的，全部没额度时走兜底模型。

2026-11-14 用户立：
  「macmini上面的可用模型在现有模型清单之外再加一个最终兜底的 fallback 模型，当模型清单
   里面的所有模型都没额度的时候走这个 fallback 模型，这个 fallback 模型就是 tokenplus 的
   deepseek-v-4.1-flash-1017 max 思考等级」

判定口径与 pi 扩展 `extensions/magpie-quota.ts` 一致（数据来自 magpie 本机端点）：
  - 剩余比例 = remaining / (used + remaining)，`limit` 字段不可靠（trae-cn 实测对不上）；
  - 一个 provider 多个额度窗口时，全部窗口剩余 <= 0 才算「没额度」；
  - 没有额度窗口的 provider（opencode-zen-free、cline）视为「无额度信息」，按可用处理；
  - magpie 连不上 → 清单里所有 magpie 模型都视为不可用 → 走兜底。

用法：
  python3 pick.py                        # 打印清单各模型的额度，并给出本次该用哪个
  python3 pick.py --json                 # 同上，机器可读
  python3 pick.py --check-model <model>  # 守卫用：exit 0 允许 / 非 0 拒绝（原因打到 stdout）
"""

import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

AGENT = Path.home() / ".pi" / "agent"
ALLOWLIST = AGENT / "patch" / "macmini-models" / "allowlist.json"
MODELS_JSON = AGENT / "models.json"
CACHE_FILE = Path("/tmp/pi-macmini-models-cache.json")
CACHE_TTL = 45
DEFAULT_BASE = "http://127.0.0.1:3425"
TIMEOUT = 4


def magpie_root() -> str:
    try:
        cfg = json.loads(MODELS_JSON.read_text(encoding="utf-8"))
        url = ((cfg.get("providers") or {}).get("magpie") or {}).get("baseUrl")
        if isinstance(url, str) and url.strip() and "$" not in url:
            url = url.strip().rstrip("/")
            return url[:-3] if url.endswith("/v1") else url
    except Exception:
        pass
    return DEFAULT_BASE


def load_json_file(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def fetch(url: str):
    req = urllib.request.Request(url, headers={"Authorization": "Bearer magpie"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        return json.loads(resp.read().decode("utf-8"))


def get_live(force: bool = False) -> dict:
    """取 magpie 的额度 + 模型目录，带 45 秒磁盘缓存（守卫与 AI 都会调，避免重复请求）。"""
    now = time.time()
    if not force:
        try:
            cached = load_json_file(CACHE_FILE)
            if now - float(cached.get("at", 0)) < CACHE_TTL:
                return cached
        except Exception:
            pass
    root = magpie_root()
    data = {"at": now, "root": root, "error": None, "quotas": None, "models": None}
    try:
        data["quotas"] = fetch(root + "/v1/magpie/quotas").get("data") or []
        data["models"] = fetch(root + "/v1/models").get("data") or []
    except (urllib.error.URLError, OSError, ValueError) as exc:
        data["error"] = f"{type(exc).__name__}: {exc}"
    try:
        CACHE_FILE.write_text(json.dumps(data), encoding="utf-8")
    except Exception:
        pass
    return data


def window_info(win: dict) -> dict:
    used = win.get("used") if isinstance(win.get("used"), (int, float)) else None
    remaining = win.get("remaining") if isinstance(win.get("remaining"), (int, float)) else None
    limit = win.get("limit") if isinstance(win.get("limit"), (int, float)) else None
    if used is not None and remaining is not None and (used + remaining) > 0:
        pct = remaining / (used + remaining) * 100
    elif remaining is not None and limit:
        pct = remaining / limit * 100
    elif used is not None:
        pct = max(0.0, 100.0 - used)
    elif remaining is not None:
        pct = 100.0 if remaining > 0 else 0.0
    else:
        pct = 100.0
    exhausted = (remaining <= 0) if remaining is not None else (pct <= 0)
    return {
        "name": win.get("name") or "额度",
        "pct": max(0.0, min(100.0, pct)),
        "exhausted": exhausted,
        "resetsAt": win.get("resetsAt") if isinstance(win.get("resetsAt"), str) else None,
    }


def provider_state(entry: dict) -> dict:
    windows = [w for w in (entry.get("windows") or []) if isinstance(w, dict)]
    if not windows:
        return {"level": "unknown", "detail": "无额度信息"}
    infos = [window_info(w) for w in windows]
    worst = min(infos, key=lambda w: w["pct"])
    if all(w["exhausted"] for w in infos):
        reset = ""
        if worst["resetsAt"]:
            reset = f"（{worst['resetsAt'][5:10]} 重置）"
        what = f"{len(infos)} 个额度包均耗尽" if len(infos) > 1 else f"{worst['name']} 耗尽"
        return {"level": "dead", "detail": what + reset}
    return {"level": "ok", "detail": f"{worst['name']} 剩余 {round(worst['pct'])}%"}


def build_states(live: dict) -> tuple[dict, dict]:
    owners = {}
    for item in live.get("models") or []:
        mid = item.get("id")
        owned = item.get("owned_by")
        if isinstance(mid, str) and isinstance(owned, str) and owned:
            owners[mid] = owned
    states = {}
    for item in live.get("quotas") or []:
        name = item.get("provider")
        if isinstance(name, str) and name:
            states[name] = provider_state(item)
    return owners, states


def model_state(model: str, owners: dict, states: dict, live: dict) -> dict:
    if "/" not in model:
        return {"level": "unknown", "detail": "模型名缺少 provider 前缀"}
    provider, rest = model.split("/", 1)
    if provider != "magpie":
        return {"level": "unknown", "detail": "不在 magpie 额度体系内（无法判定）"}
    if live.get("error"):
        return {"level": "down", "detail": "magpie 读不到额度：" + live["error"]}
    owner = owners.get(rest)
    if not owner:
        return {"level": "unknown", "detail": "未匹配到额度来源"}
    state = states.get(owner)
    if not state:
        return {"level": "unknown", "detail": f"{owner} 无额度信息"}
    return {"level": state["level"], "detail": f"{owner} {state['detail']}"}


def load_allowlist() -> dict:
    try:
        data = load_json_file(ALLOWLIST)
    except FileNotFoundError:
        die(f"清单文件不存在：{ALLOWLIST}")
    except Exception as exc:
        die(f"清单不是合法 JSON：{exc}")
    models = data.get("models")
    if not isinstance(models, list) or not models:
        die("清单缺少非空的 models 数组")
    fallback = data.get("fallback") if isinstance(data.get("fallback"), dict) else None
    return {"models": models, "fallback": fallback}


def die(msg: str) -> None:
    print(f"❌ {msg}")
    sys.exit(2)


def evaluate() -> dict:
    spec = load_allowlist()
    live = get_live()
    owners, states = build_states(live)
    rows = []
    for entry in spec["models"]:
        name = str(entry.get("model") or "").strip()
        if not name:
            continue
        state = model_state(name, owners, states, live)
        rows.append({"model": name, "display": entry.get("display") or "", **state})
    usable = [r for r in rows if r["level"] in ("ok", "unknown")]
    fallback = spec["fallback"]
    fallback_model = str(fallback.get("model") or "").strip() if fallback else ""
    fallback_ok = bool(fallback_model) and bool(fallback.get("enabled", True))
    chosen = None
    reason = ""
    if usable:
        chosen = usable[0]["model"]
        reason = "清单内还有可用额度"
    elif fallback_ok:
        chosen = fallback_model
        reason = "清单内模型全部没有额度，走兜底"
    else:
        reason = "清单内模型全部没有额度，且没有可用的兜底模型——停下来向用户汇报"
    return {
        "at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "magpie": live.get("root"),
        "magpieError": live.get("error"),
        "rows": rows,
        "usable": [r["model"] for r in usable],
        "fallback": fallback,
        "chosen": chosen,
        "reason": reason,
    }


def cmd_report(as_json: bool) -> None:
    result = evaluate()
    if as_json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return
    mark = {"ok": "✅", "dead": "⛔", "unknown": "❔", "down": "⚠️"}
    print(f"清单：{ALLOWLIST}")
    print(f"额度读取于 {result['at']}（magpie：{result['magpie']}）")
    if result["magpieError"]:
        print(f"⚠️ magpie 额度读取失败：{result['magpieError']}")
    for row in result["rows"]:
        print(f"  {mark.get(row['level'], '?')} {row['model']:<44} {row['detail']}")
    fb = result["fallback"]
    if fb:
        state = "启用" if fb.get("enabled", True) else "停用"
        thinking = fb.get("thinking") or ""
        print(f"\n兜底（{state}）：{fb.get('model')}" + (f"  思考等级 {thinking}" if thinking else ""))
    if result["chosen"]:
        print(f"\n👉 本次用：{result['chosen']}")
        print(f"   原因：{result['reason']}")
        thinking = (result["fallback"] or {}).get("thinking") if result["chosen"] == (result["fallback"] or {}).get("model") else ""
        extra = f" --thinking {thinking}" if thinking else ""
        print(f"   启动：pi -n <名字> --model {result['chosen']}{extra}")
    else:
        print(f"\n❌ {result['reason']}")


def cmd_check_model(model: str) -> None:
    result = evaluate()
    rows = result["rows"]
    names = [r["model"] for r in rows]
    if model in names:
        row = next(r for r in rows if r["model"] == model)
        print(f"✅ {model} 在清单内（{row['detail']}）")
        sys.exit(0)
    fallback = result["fallback"] or {}
    if model != (fallback.get("model") or "").strip():
        print(f"❌ {model} 不在清单里，也不是兜底模型。清单：{', '.join(names)}")
        sys.exit(1)
    if not fallback.get("enabled", True):
        print(f"❌ 兜底模型已在清单里停用：{model}")
        sys.exit(1)
    if result["usable"]:
        detail = "；".join(f"{r['model']}（{r['detail']}）" for r in rows if r["level"] in ("ok", "unknown"))
        print(f"❌ 兜底模型只在清单内模型全部没额度时才用。现在还有可用额度：{detail}")
        sys.exit(1)
    print(f"✅ 清单内模型全部没有额度（{'、'.join(names) or '清单为空'}），允许走兜底 {model}")
    thinking = fallback.get("thinking")
    if thinking:
        print(f"   记得带 --thinking {thinking}")
    sys.exit(0)


def main() -> None:
    args = sys.argv[1:]
    if "--check-model" in args:
        idx = args.index("--check-model")
        if idx + 1 >= len(args):
            print("❌ --check-model 后面要跟模型名")
            sys.exit(2)
        cmd_check_model(args[idx + 1])
        return
    cmd_report("--json" in args)


if __name__ == "__main__":
    main()
