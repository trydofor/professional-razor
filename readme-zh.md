# 剃刀 - 跨平台的套壳的电棍

> 中文 🇨🇳 | [English 🇺🇸](readme.md)
>
> 掌控着致命的闪电风暴，雷泽在战场上横冲直撞。

![razor](./razor.png)

使用前端技术（Vue/Css/Ts）实现一套代码的多端构建，

* 移动端 - Web H5, Android, iOS
* 桌面端 - Web PC, Linux, Window, MacOS

适合以下特征的技术团队和应用场景，

* 小团队，有Web能力，但少移动端经验
* 小应用，交互简单，但多平台都有且相似
* `MC`层可能复用，但`V`层`UX`不同

目标是 `write logic once, run anywhere`

* 不是 `learn once`
* 不是 `write once`

## 1.技术架构

* 💎 [TypeScript](https://www.typescriptlang.org) 主语言 [Apache]
* 🚀 [Inoic](https://ionicframework.com) - 移动端 UI 和 `cli` [MIT]
* 🚀 [Vue](https://vuejs.org) SPA 框架 [MIT]
* 🧩 [Capacitor](https://capacitorjs.com) - 原生化移动端 [MIT]
* 🧩 [Electron](https://capacitor-community.github.io/electron) - 原生化桌面端 [MIT]
* 💄 [PrimeVue](https://primevue.org) 桌面端 UI [MIT]

[MIT]: https://opensource.org/licenses/MIT
[Apache]: https://www.apache.org/licenses/LICENSE-2.0.html

## 2.编码规范

在 [Vue风格指导](https://vuejs.org/style-guide/)的基础上，
根据强类型，可读性，一致性的原则，增加以下约定，

### Rule1 - js中驼峰，html中烤串

首先，`html`和`http`不区分大小写，`mac`和`win`系统默认不区分大小写。

* 驼峰 - `camelCase`（小驼峰）和 `PascalCase`（大驼峰）
* 烤串 - `kebab-case`，全小写
* `*.vue`文件 - 必须大驼峰，与Vue官方一致
* 目录及非vue文件 - 必须烤串，与`index.js`一致
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
* 使用时仍是多个的碎片的，使用复数，如 views, compents

### Rule6 - ts编码约定

* 定义函数时，`function`优先于箭头函数
* 尽量注明类型，以`unknown`代替`any`
* 实体代码在`*.ts`，仅类型的在`*.d.ts`
* 在无类型推导时，以`TypeX[]`代替`Array<TypeX>`
* 流程控制用`if`，表达式用`||`或`??`
* 尽量使用绝对路径（`@/`），相对路径仅限于`./`和`../`

### Rule7 - vue编码约定

* emits，采用ts规范，事件名不必使用`on`前缀
* props，传递Function时，使用`do`前缀，表示`handle`
* SFC中的interface或type，可放到同名`.d.ts`，enum放在`.ts`
