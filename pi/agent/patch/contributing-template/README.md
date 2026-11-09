# CONTRIBUTING 模板

本目录供 `commit` skill 第 9n 步使用：项目缺 `CONTRIBUTING.md` / `CONTRIBUTING_cn.md` 时从这里拷过去；已有自己的 CONTRIBUTING 但缺「贡献者保留著作权 + 按项目许可证授权」两要素时，按这里的内容追加。

## 只写一种许可证，不罗列备选

模板正文只写 **MIT License**——因为团队项目绝大多数是软件项目，用 MIT。

CONTRIBUTING 是给**本项目的贡献者**读的，他只需要知道「我提交的东西会以这个项目的哪个许可证被使用」。罗列「软件项目用 MIT、非软件项目用 CC BY 4.0」会让读者困惑「到底哪个适用我」，反而削弱了文件的作用。

## 非软件项目怎么用

若项目是非软件项目（书籍、文章、教程等，用 CC BY 4.0）：把正文里所有 `MIT License` 换成 `Creative Commons Attribution 4.0 International License (CC BY 4.0)`，并同步改 `LICENSE.md` 的链接说明。其余不动。

## 为什么这两段必须写

- **「版权归你本人」**：不写，贡献者会担心提交 PR 就等于把著作权送出去，直接降低贡献意愿。
- **「提交 PR 即按项目许可证授权」**：不写，项目虽然收到了代码，却没有分发它的合法授权——版权行写 `and contributors` 就成了空话。

两段缺一不可，而且不能合成一句含糊的话。
