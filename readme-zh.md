# 剃刀 - Nuxt的跨平台的混合层

> 掌控着致命的闪电风暴，雷泽在战场上横冲直撞。
>
> 中文 🇨🇳 | [English 🇺🇸](readme.md)

![razor](./razor.png)

使用前端技术（Nuxt/Ts）实现一套代码的多端构建，

* 移动端 (H5/App) - Web, Android, iOS
* 桌面端 (PC/Exe) - Web, MacOS, Linux, Window

适合以下特征的技术团队和应用场景，

* 小团队，有些Web能力，但缺少移动端经验
* 小应用，交互简单，但多平台都有且相似
* `MC`层可能复用，但`V`层`UX`不同

目标是 `Write App once, Apply almost anywhere`

## 1.技术架构

* 💎 [TypeScript](https://www.typescriptlang.org) 主语言 [Apache]
* 🚀 [Nuxt](https://nuxt.com) WebApp 框架 [MIT]
* 🧩 [Vue](https://vuejs.org) Js 框架 [MIT]
* 💄 [UnoCss](https://unocss.dev) - 原子化 CSS [MIT]
* 📱 [Ionic](https://ionicframework.com) - 移动端组件库 [MIT]
* 📱 [Capacitor](https://capacitorjs.com) - 移动端原生库 [MIT]
* 🖥️ [PrimeVue](https://primevue.org) 桌面端组件库 [MIT]
* 🖥️ [Electron](https://capacitor-community.github.io/electron) - 桌面端原生库 [MIT]

[MIT]: https://opensource.org/licenses/MIT
[Apache]: https://www.apache.org/licenses/LICENSE-2.0.html

## 2.编码规范

在 [Vue风格](https://vuejs.org/style-guide/)[和[Nuxt 规范](https://nuxt.com/docs/guide/concepts/code-style)的基础上，
根据强类型，可读性，一致性的原则，增加以下约定，

### Rule1 - js中驼峰，html中烤串

首先，`html`和`http`不区分大小写，`mac`和`win`系统默认不区分大小写。

* 驼峰 - `smallCamel`/小驼峰 和 `PascalCase`/大驼峰
* 烤串 - `kebab-case`，全小写
* `*.vue`及相关 - 必须大驼峰，与Vue一致，
  如 `components/`, `composables/`, `stores/`
* 目录及非vue文件 - 必须烤串，与`index.js`一致，
  如 `assets/`, `pages/`, `types`, `plugins/`, `utils/`
* 代码中 - js必须驼峰，html属性和css必须烤串
* 组件标签 - 应该大驼峰，以区别于原生html标签
* 组件属性 - js必须小驼峰，html必须烤串
* emit事件 - 必须烤串，因其仅做字符串，无自动转换
* i18n - 应该以js取代json，key应该驼峰

### Rule2 - js中单引号，html中双引号

鉴于html中通常使用双引号，且在里面会有简单的js代码，

* js内容 - 必须单引号
* html内容 - 必须双引号

### Rule3 - 分号和逗号，同主语言一致

分号，与主语言一致，否则随缘，

* java - 结尾保留分号
* kotlin，scala等 - 结尾不带分号

逗号，尽量添加，方便增减和调整顺序，

* 数组，对象，ts等支持逗号结尾

### Rule4 - 组件名不可`Index.*`

名叫Index的组件，在调试和开发中可读性很差，

* 优先使用全名（通过index.ts进行`import`和`export`）
* 或手工指定`name`属性（建议自动推导）

### Rule5 - 整体的用单数，碎片的用复数

根据vue官方模板中命名规则，大部分会是复数，

* 使用时视为单一的完整的，使用单数，如 store, route
* 使用时仍是多个的碎片的，使用复数，如 views, components

### Rule6 - ts编码约定

* 定义函数时，`function`优先于箭头函数
* 尽量注明类型，以`unknown`代替`any`
* 定义时用`undefined`，使用时用`null`
* 实体代码在`*.ts`，仅类型的在`*.d.ts`
* 在无类型推导时，以`TypeX[]`代替`Array<TypeX>`
* 流程控制用`if`，表达式用`||`或`??`
* 尽量使用绝对路径（`@`,`~`），相对路径仅限于`./`和`../`
* 使用 `&` 作为 layer的路径别名

### Rule7 - vue编码约定

* emits，采用ts规范，事件名不必使用`on`前缀
* props，传递Function时，使用`do`前缀，表示`handle`
* SFC中的interface或type，可放到同名`.d.ts`，enum放在`.ts`

## 3.自己动手

```bash
## 💚 asdf 管理 node 版本
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.15.0
## 配置 zsh
cat >> ~/.zshrc << 'EOF'
export ASDF_NODEJS_AUTO_ENABLE_COREPACK=true
export ASDF_NODEJS_LEGACY_FILE_DYNAMIC_STRATEGY=latest_installed
source "$HOME/.asdf/asdf.sh"
EOF
## 支持 .nvmrc 或 .node-version
cat >> ~/.asdfrc << 'EOF'
legacy_version_file=yes
EOF

## 安装 nodejs 插件
asdf plugin add nodejs
## 安装 nodejs 并 corepack enable
asdf install nodejs
## 通过 package.json 和 corepack
pnpm -v
## Corepack is about to download
pnpm dev:init

## ✅ for CI
## 安装 pnpm-hoist-layer 到 devDeps
pnpm -w i --no-frozen-lockfile
## 重置 ci 锁文件
git restore pnpm-lock.yaml
## 根据锁文件，安装依赖
pnpm i --frozen-lockfile

## 💚 for Dev
pnpm -w i
pnpm i

## 🧪 测试
pnpm dev:test
## 运行 web
pnpm play:web

## 💎 其他
## 通过bash重置
pnpm store prune
find . -name "node_modules" -type d -prune -exec rm -rf {} +
find . -name "pnpm-lock.yaml" -type f -exec rm -f {} +
asdf install
pnpm -w 
pnpm i

## 删除 .nuxt, .output, dist
pnpm del:gen
## 删除 node_modules
pnpm del:dep
## 删除 node_modules, pnpm-lock.yaml
pnpm del:all
```
