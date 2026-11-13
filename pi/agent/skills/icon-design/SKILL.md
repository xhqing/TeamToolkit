---
name: icon-design
description: "Use this skill whenever you are about to create or modify ANY icon, logo, favicon, app icon, agent logo, badge-style graphic, or README header image — in SVG, PNG, or any format — for a project, VSCode extension, app, or agent. Read it BEFORE drawing the first shape or picking colors. Enforces rounded-only outlines (no sharp corners), color harmony, composition, and a pre-flight checklist. Triggers on: 'icon', 'logo', '图标', '徽标', 'favicon', 'app icon', '扩展图标', '设计图标', '画个 logo', '做个图标'."
---

# 图标 / Logo 设计规范

设计 icon、扩展图标、项目 logo、agent logo、favicon、头像、徽章等**任何图标类视觉元素**时，必须达到「有设计感、有品味」的底线，不能随意凑一个就交差。本 skill 适用于所有出图场景，包括 commit skill 的 LOGO 生成、agent 脚手架的 `assets/logo.svg`、VSCode 扩展图标等。

## 一、外轮廓形状（硬性要求）

外轮廓**必须是圆角矩形、圆角正方形、圆形**三者之一，**一律用圆角，不许有棱角**——直角、锐角、尖角一律禁止。

- **圆角矩形 / 圆角正方形**：四角用 `rx` 倒圆角。圆角要够大、肉眼可见，不要用 `rx=4` 这种近乎直角的小倒角糊弄。
  - 扩展图标（512×512）：`rx=112` 左右（约占边长 22%）
  - 项目 logo 横幅（640×200）：`rx=28`
  - 通用 app 图标（1024×1024）：`rx=225` 左右
- **圆形**：等宽高 + `rx` 取半径（= 宽度的一半），或直接用 `<circle>`。

## 二、品味要求（每次都要自检）

- **配色协调**：优先用渐变，避免高饱和纯色撞色；主色搭配邻近色，深浅要有层次，不要刺眼。一组稳妥的配色：主色 + 主色的深一档（做渐变两端）+ 中性背景。
- **构图**：主体居中、四周留白舒适（主体不要顶满边缘，四周留约 10%–15% 边距做呼吸空间）、元素比例协调、风格统一。
- **不堆砌**：元素精炼，不花哨、不杂乱。emoji 可以用，但要搭配合适的色卡背景与构图，不要在纯色块上随手丢一个 emoji 就算图标。

## 三、出图前自检清单（四项全过才算完成）

- [ ] ① 外轮廓是圆角矩形 / 圆角正方形 / 圆形？有棱角则改圆角。
- [ ] ② 配色协调？无刺眼撞色、有层次？
- [ ] ③ 主体居中、留白舒适、比例协调？
- [ ] ④ 含 `<text>` 文字元素？用 `scripts/check-text-bounds.py` 实测 PASS（见「六、文字边界硬校验」，机器判定，肉眼与源码检查不算数）；不含文字则跳过。

## 四、标准圆角图标 SVG 骨架（可直接改用）

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" role="img" aria-label="<图标描述>">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="<主色亮>"/>
      <stop offset="100%" stop-color="<主色深>"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#g)"/>
  <!-- 主体图形居中放这里；若用 emoji，配 dominant-baseline="central" + text-anchor="middle" 在 (256,256) 居中 -->
</svg>
```

要点：圆角矩形背景（`rx=112`）+ 渐变填充 + 居中主体；文字元素的宽度必须过第六章的边界硬校验。

## 五、Logo 专项规范（logo / agent logo / 项目 logo 适用）

### Logo / 图标资产文字一律用英文

**所有项目的 logo、图标类视觉资产文件（`assets/logo.svg` 及其它 SVG / 图标类文件），文件内部出现的文字一律用英文，不放中文。**

- **为什么**：logo 是开源仓库面向全球读者的视觉标识，中文受众已有 `README_cn.md` 双语通道、不需要 logo 里再翻译一遍；且 SVG 里的中文依赖查看环境的字体回退（GitHub 网页渲染、各操作系统的渲染器字体不同），中文字体缺失时显示为方块或样式突兀，渲染效果不可控，而英文用通用字体族（Segoe UI / Helvetica / Arial）在哪个环境都稳定。
- **怎么用**：新建 logo.svg / 图标时，文字（项目名、副标题、职称等）一律写英文；副标题口径与 README 英文版标题对齐（如「Day-K Trend-Following Strategy」），两处不漂移。既有 logo 里已混入中文的，接触一处改一处。
- **边界**：本条只管「logo / 图标类视觉资产文件内部的文字」；README / 文档正文的中英双语、策略文档、CHANGELOG 等各自的语言规范不受影响。

### Logo 视觉区分：Agent 门面用统一模板，子项目用项目象征 logo

**Agent 主仓库（公开门面）的 logo 用团队统一模板——emoji + 名称 + 职称（名称：历史惯例为拟人名，如 Atlas / Anvil；新建 agent 用简洁名，如 `cuAgent`）；Agent 名下子项目（研究本体 / 组件 / 工具仓库）的 logo 用项目象征意义的图形——象征元素 + 项目名 + 项目定位一句话，不用 agent 门面模板。**

- **为什么**：名称（拟人名 / 简洁名）是 agent 实体的标识，子项目不是 agent、是 agent 的产出物——子项目若沿用门面模板，会与门面完全同貌、分不清「这是 agent 本人还是 agent 的项目」。
- **怎么用**：新建仓库时先判断它是 agent 门面还是子项目，选对应模板：agent 门面走统一模板（拟人名或简洁名作为「名称」）；子项目的象征元素取项目主题（如 📈 日 K 趋势、⏱️ 日内节奏），配色避开团队已用组合，副标题写项目定位并与 README 对该项目的描述口径一致。既有门面 / 本体 logo 撞脸的存量，接触时顺手改。
- **边界**：本条管「logo 用哪类视觉」；logo 内文字一律英文由上一小节管，两条并行适用。

## 六、文字边界硬校验（含 `<text>` 的 SVG 必做）

图标 / logo 里放文字（项目名、副标题等）时，**文字宽度不能凭直觉估**——必须「事前预算 + 事后实测」双关卡，实测不过关不许交付。

- **为什么**：`<text>` 的实际渲染宽度是逐字符 advance width 之和，随字体、字号、字重变化，凭直觉给 x 坐标和 font-size 经常偏差 20% 以上（长副标题尤甚）；文字一旦超出 viewBox 会被**直接裁切**（SVG 不会自动缩小文字），而看 SVG 源码发现不了，只有渲染出来才看得见。这是「文字超出 icon」反复出现的根因。
- **事前预算（写 SVG 时）**：英文比例字体平均字符宽 ≈ 0.55 em，全角 / CJK 字符 ≈ 1.0 em，即 `预估宽度 ≈ 英文字符数 × 0.55 × font-size`。要求 `起点 x + 预估宽度 ≤ 画布宽 × 95%`。超了优先**缩短文字**（精简副标题、拆两行），其次降字号；预算能过才写进文件。
- **事后实测（交付前硬性关卡）**：跑本 skill 自带校验脚本，exit 0 才算过：
  ```bash
  python3 <skill 目录>/scripts/check-text-bounds.py <logo.svg> [--margin-pct 5]
  ```
  原理：渲染完整 SVG 与「移除全部 `<text>`」两版图像并逐像素相减，得到纯文字像素的包围盒，校验其落在安全区（画布四周留默认 5% 边距）内——不依赖字体度量、对任何字体和排版都准。依赖 `rsvg-convert`（`brew install librsvg`）与 Pillow（`pip3 install pillow`）。
- **口径说明**：5% 边距是防裁切的硬底线，与第二章「主体四周留白 10%–15%」的审美要求相互独立、并行适用。

## 七、为什么

图标是项目和产品的门面，第一眼决定观感与信任。尖锐棱角、随意构图显得廉价、不专业；圆角更现代、柔和、有品质感，也贴合当下主流设计语言（macOS、iOS、Material 都以圆角为主）。
