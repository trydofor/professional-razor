# Razor - Nuxt CrossPlatform Hybrid Layers

> With a deadly lightning storm at his command, Razor charges into battle.
>
> English 🇺🇸 | [中文 🇨🇳](readme-zh.md)

![razor](./razor.png)

Use front-end tech (Nuxt/Ts) to build multi-platform from one codebase,

* Mobile (H5/App) - Web, Android, iOS
* Desktop (PC/Exe) - Web, MacOS, Linux, Window

Suitable for teams and app scenarios such as,

* small team with some web skills but little mobile experience
* small app with simple interactions, but multi-platform and similar
* The `MC` layer can be reused, but the `V` layer `UX` is different

The goal is `Write App once, Apply almost anywhere`

## 1.Tech Arch

* 💎 [TypeScript](https://www.typescriptlang.org) Main Language [Apache]
* 🚀 [Nuxt](https://nuxt.com) WebApp Framework [MIT]
* 🧩 [Vue](https://vuejs.org) Js Framework [MIT]
* 💄 [UnoCss](https://unocss.dev) - Atomic CSS [MIT]
* 📱 [Ionic](https://ionicframework.com) - Mobile UI [MIT]
* 📱 [Capacitor](https://capacitorjs.com) - Mobile native [MIT]
* 🖥️ [PrimeVue](https://primevue.org) Desktop UI [MIT]
* 🖥️ [Electron](https://capacitor-community.github.io/electron) - Desktop native [MIT]

[MIT]: https://opensource.org/licenses/MIT
[Apache]: https://www.apache.org/licenses/LICENSE-2.0.html

## 2.Code Style

Based on the [Vue Style](https://vuejs.org/style-guide/) and [Nuxt Eslint](https://nuxt.com/docs/guide/concepts/code-style), with the principles of
type safety, readability, and consistency, add the following conventions,

### Rule1 - camel in js, kebab in html

First, `html` and `http` are case-insensitive, and `mac` and `win` OS are case-insensitive by default.

* `camel` - `smallCamel` and `BigCamel`/`PascalCase`
* `kebab` - `kebab-case` all lowercase
* `*.vue` and its file - MUST be `BigCamel`, consistent with Vue
* dir and non-vue file - MUST be `kebab` consistent with `index.js`
* source code - js MUST be `camel`, html attr and css MUST be `kebab`
* component tag - SHOULD be `BigCamel`, to distinguish from original html
* component prop - in js MUST be `smallCamel`, in html MUST be `kebab`
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
* for multiple fragments, use plural, e.g. views, components

### Rule6 - ts coding convention

* to define function, `function` is better than `arrow` lambda
* try to specify type, `unknown` instead of `any`
* `undefined` in definition, `null` in usage
* entity code is in `*.ts`, type-only is in `*.d.ts`
* `TypeX[]` instead of `Array<TypeX>` when no type inference
* Use `if` for flow control, `||` or `??` for expression
* Use absolute path (`@/`), relative path is only `./` and `../`

### Rule7 - vue coding convention

* emits, using the ts specification, event name without `on` prefix
* props, use `do` prefix for `handle` when passthrough Function
* interface/type in SFC, can be in same-name `.d.ts`, but enum in `.ts`

## 3.DoIt Yourself

```bash
## ✅ for CI
## install pnpm-hoist-layer to devDep
pnpm -w i --no-frozen-lockfile --ignore-pnpmfile
## reset the ci lockfile
git restore pnpm-lock.yaml
## install all deps by lockfile
pnpm -r i --frozen-lockfile

## 💚 for Dev
pnpm -w i --ignore-pnpmfile
pnpm -r i
# if Cannot find package 'nuxi' when nuxi prepare
pnpm -r i -f

## 🧪 testing
pnpm dev:test
## rm .nuxt, .output, dist
pnpm del:gen
## rm node_modules
pnpm del:dep
## rm node_modules, pnpm-lock.yaml
pnpm del:all
```
