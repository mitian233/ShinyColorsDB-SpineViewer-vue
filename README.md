# ShinyColorsDB-SpineViewer

![pasted-image-1773239439104.webp](https://files.seeusercontent.com/2026/03/11/w8fZ/pasted-image-1773239439104.webp)

## 组件库

界面使用本地 SCUI（Vue 3 + Reka UI）组件库，源项目位于相邻目录 `../scui`。
已构建的组件包保存在 `vendor/shiny-colors-ui-0.1.0.tgz`，通过 `file:` 依赖安装，
克隆本仓库后不需要额外克隆 SCUI。

SCUI 更新后，在其项目中运行 `npm run build`，再在本项目中更新组件包和锁文件：

```sh
npm pack ../scui --pack-destination ./vendor --ignore-scripts
pnpm install --force
pnpm build
```

若 SCUI 版本号变化，同时更新 `package.json` 中的包文件路径。按钮、普通选择框、开关、
复选框、弹窗和加载提示直接使用 SCUI；衣装分组选择与抽屉使用 Reka UI 配合 SCUI 样式，
颜色选择器提供原生取色和十六进制输入。系统深色模式通过全局主题变量适配。

## 表示言語と Webfont

UI の文言とページの言語は日本語です。フォントは R2 上の
[Humming / Qingyin](https://r2img.3kn.jp/scui-fonts/2026-10-02-e31057cc/fonts.css) を使用します。
Humming を優先し、Qingyin とシステムフォントをフォールバックとして指定しています。

フォント CSS は `media="print"` で非同期に取得し、読み込み後に `media="all"` へ切り替えます。
全ての `@font-face` が `font-display: swap` を使用し、`unicode-range` に応じて必要な
WOFF2 のみを取得します。フォント取得中や通信失敗時も、システムフォントで表示できます。

## Scripts

| Command             | Description                    |
| ------------------- | ------------------------------ |
| `pnpm dev`          | Start Vite dev server          |
| `pnpm build`        | Typecheck and production build |
| `pnpm lint`         | Run ESLint                     |
| `pnpm lint:fix`     | Run ESLint with auto-fix       |
| `pnpm format`       | Format with Prettier (write)   |
| `pnpm format:check` | Check Prettier formatting      |
| `pnpm test`         | Run Vitest                     |
