# 四大坑详解与定制指南

来源：2026-09-01 三份中文个人文档 PDF 的实际事故排查（MD → pandoc → Chrome headless 打印链路），每个坑都有像素级扫描数据佐证。排查与修复全过程记录在 assistant-agent 的本地变更日志。

## 坑 1：pandoc 默认窄栏样式（最常见、最隐蔽）

**根因**：pandoc `--standalone` 输出的 HTML 自带一段默认样式，其中有：

```css
body {
  margin: 0 auto;      /* 居中 */
  max-width: 36em;     /* 限宽！ */
  padding-left: 50px;  /* 四周 50px */
  padding-right: 50px;
  padding-top: 50px;
  padding-bottom: 50px;
}
```

自定义 CSS 如果只写了 `body { margin: 0; font-size: 10.5px }` 之类的部分属性，`max-width: 36em` 和 `padding: 50px` 会保留——正文被钉死在约 378px 窄栏（A4 打印可用宽约 688px），行数翻倍、页数虚多一倍。

**两种症状**（取决于 margin 是否被覆盖）：

| margin 状态 | 视觉症状 | 实测数据（来源案例） |
|---|---|---|
| 未覆盖（`0 auto` 生效） | 窄栏**居中**，像一本窄书芯，左右各留约 20% 空白，看着「还行」最易漏判 | 5 页，墨迹边界 20% / 80% |
| 被覆盖为 `0` | 窄栏**靠左**，右半边大片空白，残缺感明显 | 4 页，墨迹边界 13% / 48% |

**修复**（default.css 已内置，自己写 CSS 时必须保留这三行）：

```css
body {
  margin: 0;
  max-width: none;
  padding: 0;   /* 页边距交给 @page margin 负责，不要叠加 */
}
```

**为什么 `--include-in-header` 注入的 CSS 能覆盖**：pandoc 模板里 `$header-includes$` 的位置在默认 `<style>` 块**之后**，CSS 同名规则相同特异性下后者胜。若手工把 CSS 插到默认样式之前，则覆盖无效。

**验证修复效果**：满宽后墨迹边界应与 `@page` 边距对应（14mm 边距 → 左 6.7% / 右 93.3%），页数回落（案例：4 页 → 2 页）。

**伴生现象——纸张也错**：不注入 CSS（或 CSS 未生效）时，Chrome headless 打印默认 **Letter（612×792pt）而非 A4**——`@page { size: A4 }` 随整份 CSS 一起失效。看到 Letter 基本可断定 CSS 没生效（检查 `<style>` 是否真的包住了注入内容）。

**注入方式陷阱**：`pandoc --include-in-header=<文件>` 对文件是**裸文本插入、不自动包 `<style>` 标签**——直接传 CSS 文件会让整段 CSS 变成无效 HTML 文本、一条都不生效（症状即上面的 Letter + 居中窄栏）。md2pdf.sh 已内置 `<style>` 包装，自己手搓命令时要先包标签。

**verify_pdf.swift 判据实测**（三组样本验证过）：居中窄栏 14%/84% 正确报警、正常 A4 满宽 6.7%/93.3% 不误报、末页短行提示需对照其它页判断。

## 坑 2：Chrome headless 打印错误页

**症状**：产出的 PDF「打开无内容」——实际是 Chrome 把 `ERR_FILE_NOT_FOUND "Your file couldn't be accessed"` 错误提示页打印成了 PDF。典型特征：1 页、几十 KB、正文只有一行英文错误信息。

**根因**：`--print-to-pdf` 传入的 `file://` 路径不存在（典型：相对路径拼错、源文件在别的目录）。Chrome 对此**不报错、正常退出**，只产出错误页 PDF。

**防御**：

1. 打印命令一律用 `file://` + 校验过的绝对路径（md2pdf.sh 已内置）。
2. 产出后核对页数——1 页 + 体积异常小的中文文档必是错的。
3. verify_pdf.swift 会把无墨迹页标 ❌。

## 坑 3：视觉模型验证不可靠

**事故实录**：同一批 PDF，两轮「截图 + 视觉模型」抽查都给出「排版正常、文字满宽」的结论；像素级扫描实测墨迹右边界停在 48%。视觉模型对「内容是否存在、乱码与否」判断尚可，对「排版宽度是否占满页面」这类需要精确空间度量的问题不可信。

**正确姿势**：布局验证一律定量——渲染每页后扫描最左 / 最右非白像素列 ÷ 页宽，与 `@page` 边距的理论值对照。verify_pdf.swift 已实现，判据见其文件头注释。视觉模型最多用于内容层面的抽查（乱码、错位、重叠），不能作为布局验收依据。

## 坑 4：校验截图必须互异

**事故实录**：一次逐页校验中，标注为「第 1 页」「第 4 页」的两张校验图 md5 完全相同——截图环节复制错误，校验实际只看了同一页，问题页从未被检查。

**防御**：多页 PDF 截图抽查后，`md5` 核对各页截图互异；全同即校验流程失效，重截。

## 工具链对比（为什么选 Chrome headless）

| 维度 | pandoc + Chrome headless | weasyprint |
|---|---|---|
| 中文排版 | PingFang SC 渲染紧凑专业 | 行高偏松，同样内容页数明显更多 |
| 分页控制 | 完整支持 `@page`、`break-*` | 支持但细节行为有差异 |
| 依赖 | pandoc + Chrome（常用机器多已有） | Python + 一串渲染依赖 |
| 结论 | 默认选择 | 仅无 Chrome 环境时备选 |

同样内容实测：Chrome 版 2 页（满宽修复后），weasyprint 版 5~6 页。

## default.css 定制指南

- **字号**：`body { font-size }` 紧凑文档 10.5px（默认）；阅读型文档（说明书、笔记）建议 11~12px，字号改大后页数会涨，属正常。
- **主题色**：`#2c5f8a`（标题、左边框）与 `#0f3a5c`（加粗）全局替换即可。
- **边距**：改 `@page { margin }` 后，verify_pdf.swift 的墨迹边界判据同步换算（mm ÷ 210 × 100%）。
- **双栏**：加 `body { column-count: 2; column-gap: 8mm }`；注意与 `max-width: none` 同时生效，验证时左右边界仍应对称。
- **页眉页脚**：Chrome headless 的 `--no-pdf-header-footer` 已去掉默认页眉页脚；`@page` 的 `@bottom-center` 等页码规则 Chrome 不支持，需要页码时用 CSS counter + fixed 元素，或改用 weasyprint。
- **保留覆盖块**：无论怎么定制，开头的 `margin: 0; max-width: none; padding: 0` 三行必须保留（坑 1）。
