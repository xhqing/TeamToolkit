# macmini 可用模型清单（用户动态维护）

2026-11-12 用户立：

> magpie 的模型必须是 hy4free 或者 deepseek-4.1-flash-1017。
> 需要专门维护一个 macmini 上面的可用模型清单，这个清单我会根据情况动态调整，
> 目前只有 magpie 的 hy4free 和 deepseek-4.1-flash-1017。

上面是立规当时的原话。2026-11-13 用户又明确授权加入 `hy4std`，见下文「2026-11-13 变更」节。

## 清单在哪

`allowlist.json`（本目录）。守卫 `~/.pi/agent/extensions/macmini-model-guard.ts`
**每次调用时实时读取**，所以改完不用重启会话、也不用改代码。

当前三项：

| 清单里的完整模型名 | 说明 |
|---|---|
| `magpie/auto/hy4free` | Hy4（magpie auto 路由，免费） |
| `magpie/codearts/deepseek-v4.1-flash-1017` | DeepSeek V4.1 Flash 1017（magpie CodeArts 通道，免费） |
| `magpie/auto/hy4std` | Hy4（magpie auto 路由，标准计费通道，非免费） |

## 2026-11-13 变更

用户明确授权把 `magpie/auto/hy4std` 加入清单。背景：它在 Pi 的模型列表里可选，与
`hy4free` 对外声明的能力参数完全相同（上下文 100 万、最大输出 64K、支持图片输入、
只支持 `high` 推理、支持工具调用），两者都是走 WorkBuddy 与 WorkBuddy AI 两个账号的
`auto/*` 路由组；区别只在计费——`hy4free` 上游标记 `free: true`、价格全 0，
`hy4std` 标记 `free: false`、带 `rate: 0.29`，会消耗 WorkBuddy Free plan 的 credits
额度（配置里没写这个系数的换算单位，具体扣多少额度由 magpie 计算）。

加入清单**不等于把它变成免费模型**：它仍是用户当次同意后放行的计费通道，日常优先用
免费的两项。守卫只读清单、不判断免费与否，清单即唯一权威；这条澄清不动原先
「默认只用免费模型、用其它付费模型须经用户同意」的规矩——本次正是用户行使了同意权。

## 2026-11-14 变更：最终兜底模型

用户立：清单之外再加一个最终兜底的 fallback——**清单内模型全部没额度时走它**。

| 字段 | 值 |
|---|---|
| `fallback.model` | `tokenplus/deepseek/deepseek-v4.1-flash-1017` |
| `fallback.thinking` | `max`（启动命令必须带 `--thinking max`，或写成 `--model …:max`） |
| `fallback.enabled` | `true`（改 `false` 即停用兜底） |

「是否全部没额度」不做静态判断，由 `pick.py` 实时读 magpie 额度判定（口径与 pi 扩展
`/mq` 一致）：清单里还有可用额度 → 用兜底一律被守卫拦下；全部耗尽 / magpie 读不到额度 →
放行兜底。

## 选模型：pick.py

```bash
python3 ~/.pi/agent/patch/macmini-models/pick.py          # 看清单各模型额度 + 本次该用哪个 + 启动命令
python3 ~/.pi/agent/patch/macmini-models/pick.py --json   # 机器可读
python3 ~/.pi/agent/patch/macmini-models/pick.py --check-model <模型>   # 守卫内部用
```

输出末尾直接就是可用的启动命令，例如：

```
👉 本次用：tokenplus/deepseek/deepseek-v4.1-flash-1017
   原因：清单内模型全部没有额度，走兜底
   启动：pi -n <名字> --model tokenplus/deepseek/deepseek-v4.1-flash-1017 --thinking max
```

额度结果带 45 秒磁盘缓存（`/tmp/pi-macmini-models-cache.json`），避免守卫与 AI 同时调用时重复请求。

## 怎么改

直接编辑 `allowlist.json` 的 `models` 数组，字段：

```json
{ "model": "magpie/<provider>/<model>", "display": "给人看的名字", "note": "备注（可选）" }
```

`model` 必须写 pi 里能直接用的**完整名**（provider/model，与 `--model` 后面的值一字不差）。
改完跑一次校验：

```bash
python3 ~/.pi/agent/patch/macmini-models/check.py          # 只校验格式
python3 ~/.pi/agent/patch/macmini-models/check.py --ping   # 在 macmini 上逐个实测
```

## 守卫怎么用它

- 清单里的模型 → 放行；
- 兜底模型（`fallback.model`）→ 仅当清单内模型全部没额度时放行（实时问 `pick.py`），
  且必须带 `--thinking max`；清单里还有可用额度时用兜底会被拦下；
- 清单外的模型 → 拦截（包括 magpie 的其它模型，如 `magpie/auto/deepseek-v4.1-flash-1017`）；
- 命令不带 `--model` → 取 `~/.pi/agent/settings.json` 的默认 provider/model 拼完整名，
  不在清单里也拦（防止「默认模型」绕过清单）；
- 清单缺失 / 解析失败 → 保守拦截并提示修清单；
- 逃生门：命令末尾 `# AI_AUTHORIZED_MODEL`（仅限用户当轮明确同意用清单外的模型）。

## 与隧道的关系

清单里的 magpie 模型要经过 `patch/magpie-tunnel/` 的常驻 SSH 反向隧道才能从 macmini
访问到本机 magpie。清单模型集体不可用时，先查隧道（`install.sh --status`）再向用户
汇报原因，不要换清单外的模型顶替。