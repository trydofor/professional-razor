# Razor - CrossPlatform Hybrid Starter

> English 🇺🇸 | [中文 🇨🇳](readme-zh.md)
>
> With a deadly lightning storm at his command, Razor charges into battle.

![razor](./razor.png)

Use front-end tech (Vue/Css/Ts) to build multi-platform from one codebase,

* Mobile (H5/App) - Web, Android, iOS
* Desktop (PC/Exe) - Web, MacOS, Linux, Window

Suitable for teams and app scenarios such as,

* small team with some web skills but little mobile experience
* small app with simple interactions, but multi-platform and similar
* The `MC` layer can be reused, but the `V` layer `UX` is different

The goal is `write logic once, run anywhere`

* not `learn once`
* not `write once`

## 1.Tech Archi

* 💎 [TypeScript](https://www.typescriptlang.org) Main Language [Apache]
* 🚀 [Inoic](https://ionicframework.com) - Mobile UI and `cli` [MIT]
* 🚀 [Vue](https://vuejs.org) SPA Framework [MIT]
* 🧩 [Capacitor](https://capacitorjs.com) - Mobile native [MIT]
* 🧩 [Electron](https://capacitor-community.github.io/electron) - Desktop native [MIT]
* 💄 [PrimeVue](https://primevue.org) Desktop UI [MIT]

[MIT]: https://opensource.org/licenses/MIT
[Apache]: https://www.apache.org/licenses/LICENSE-2.0.html

## 2.Code Style

Based on the [Vue Style Guide](https://vuejs.org/style-guide/), with the principles of
type safety, readability, and consistency, add the following conventions,

### Rule1 - camel in js, kebab in html

First, `html` and `http` are case-insensitive, and `mac` and `win` OS are case-insensitive by default.

* `camel` - `camelCase`(small) and `PascalCase` (big)
* `kebab` - `kebab-case` all lowercase
* `*.vue` file - MUST be `big-camel`, consistent with Vue official
* dir and non-vue file - MUST be `kebab` consistent with `index.js`
* source code - js MUST be `camel`, html attr and css MUST be `kebab`
* component tag - SHOULD be `big-camel`, to distinguish from original html
* component prop - in js MUST be `small-camel`, in html MUST be `kebab`
* emit event - MUST be `kebab`, treated as string, no auto-conversion
* i18n - SHOULD use js instead of json, key SHOULD be `camel`

### Rule2 - single in js, double in html

Since double quotes are usually used in html which may contain simple js code,

* js content - MUST be single quotes
* html content - MUST be double quotes

### Rule3 - semicolon and comma, same as main language

semicolon, same as your main language, or otherwise as they are.

* java - keep the semicolon at the end
* kotlin, scala, etc - without semicolon

comma, as much as possible to easy to add, sub and reorder,

* arrays, objects, ts, etc. support comma endings

### Rule4 - Component name must not be `Index.*`

Components named Index are hard to read, debug and develop.

* prefer to use the full name (`import` and `export` via index.ts)
* or specify the `name` attribute (auto inference is recommended)

### Rule5 - Use singular for whole, plural for fragment

According to the official Vue naming rules, most things are plural,

* for a single entity, use singular, e.g. store, route
* for multiple fragments, use plural, e.g. views, compents

### Rule6 - ts coding convention

* to define function, `function` is better than `arrow` lambda
* try to specify type, `unknown` instead of `any`
* entity code is in `*.ts`, type-only is in `*.d.ts`
* `TypeX[]` instead of `Array<TypeX>` when no type inference
* Use `if` for flow control, `||` or `??` for expression
* Use absolute path (`@/`), relative path is only `. /` and `../`

### Rule7 - vue coding convention

* emits, using the ts specification, event name without `on` prefix
* props, use `do` prefix for `handle` when passthrough Function
* interface/type in SFC, can be in same-name `.d.ts`, but enum in `.ts`
