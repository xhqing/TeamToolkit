# magpie 模型额度标注（magpie-quota）

在 pi 里选 magpie 模型时，直接看到「这个模型的额度还剩多少、是不是已经耗尽」，免得切到一个没额度的模型白等一次请求。

## 为什么不用内置 `/model`

pi 的模型选择器每行只渲染 `model.id [provider]`，配置里的 `name` 只在底部「Model Name」详情行显示；内置交互命令也不允许扩展覆盖（同名扩展命令会被跳过）。所以只能另开一个带标注的选择器。

## 怎么用

| 命令 | 作用 |
|---|---|
| `/mq` | 打开带额度标注的 magpie 模型选择器：`✅` 可用排在前面、`❔` 无额度信息居中、`⛔` 已耗尽排最后；直接输入文字即过滤，回车切换、`esc` 取消 |
| `/mq 关键词` | 打开时预填过滤词（例如 `/mq hy4`） |
| `/mq list` | 不开选择器，只打印各上游 provider 的额度摘要 |

另外，当前模型是 magpie 时会自动在 footer 状态行挂一条额度状态（如 `⛔ magpie workbuddy Credits 耗尽（11-30 重置）`），每 3 分钟刷新一次；切到非 magpie 模型自动清除。这样即使不打开选择器，也能一眼看出当前模型是不是已经没额度了。

## 数据来源

| 端点 | 用途 |
|---|---|
| `GET /v1/magpie/quotas` | 每个上游 provider 的额度窗口（`used` / `remaining` / `resetsAt`） |
| `GET /v1/models` | 模型的 `owned_by` 即额度 provider 名（model → 额度来源的映射） |

baseUrl 取 `~/.pi/agent/models.json` 的 `providers.magpie.baseUrl`（`…:3425/v1`，脚本会去掉尾部 `/v1` 再拼管理端点），也可用环境变量 `MAGPIE_BASE_URL` 覆盖，默认 `http://127.0.0.1:3425`。magpie 只跑在本机，macmini 通过 SSH 反向隧道映射同一地址，所以两端用同一个地址。

## 判定口径（按实测数据字段定的）

- **剩余比例 = `remaining` / (`used` + `remaining`)**：`limit` 字段不可靠——实测 trae-cn 的 `remaining` 与 `limit` 对不上，而 `used + remaining` 恒等于 100（百分比口径），所以只用这两个字段。
- **多窗口取最紧的那个**：一个 provider 可能有多个额度窗口（codearts 有三个积分包），只有**全部**窗口剩余 ≤ 0 才算「耗尽」，否则按剩余最少的窗口提示。
- **没有窗口的 provider 按「无额度信息」处理**（opencode-zen-free、cline 这类），归入可用一类、排在中间，不误判成耗尽。
- **接口不通**：所有模型统一显示 `❔ 额度接口无响应`，不会拿旧数据冒充正常。

## 局限

- 额度是 magpie 的读取值（响应里带 `readAt`），不是每次请求实时结算，可能滞后于最后一次调用。
- 只能覆盖 magpie 路由器后面挂的上游额度；pi 里其它 provider（anthropic / deepseek 等）不在此列。
