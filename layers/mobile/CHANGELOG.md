# @fessional/razor-mobile

## 0.8.0

### Minor Changes

- e0eb8f2: ♻️ Ionic slot vs vue/no-deprecated-slot-attribute #229

- 11ba023 ♻️ 🚀 xxxNumStr util and decimal.js, launch example #222
- e33595a 💚 add version to title, mts to mjs #229
- d1bea4b ♻️ Ionic slot vs vue/no-deprecated-slot-attribute #229
- 40960b7 ✨ onIonViewWillEnter eat thrown #226
- 4b17c53 ✨ alignNumStr to Fixed Scale NumStr #222
- e0eb8f2 💚 dev prerelease from 0.8.0 #217

## 0.7.10

- a522e09 ✨ add NotifyThrown #206
- 32e3441 ✨ ♻️ global and app NotifyStyle and Level #206
- ffaa747 ✨ default globalLoadingStatus for fetch #211
- 0eea561 ✨ createNotify to control app notify #204
- 63c77f9 ⬆️ pinia 3.0.2, ionic 8.5.4
- ca5928b ♻️ AppNotifyMode replace magic string #206
- 52ade8d ⚡️ auth i18n and CapturedHook types
- bb0ec23 🚸 2s toast duration and top/mid slots
- a6eb2a8 ⬆️ nuxt 3.16.2, ionic 8.5.3
- 429ad23 ✨ email and oauth login #3
- e275da0 🙈 pnpm ignore tests and CHANGLOG
- 0aa9901 🚸 vscode extention config

## 0.6.10

- 696a5f0 ➕ validator, ts-md5 to common dep
- e9b858a ✨ throttle request without ui #196
- 821ce15 👷 renovate and minor deps
- 601e37b ⬆️ taze major and renovate
- f1da616 ✨ message or code of legacy result #190
- c48ce9b ✨ form component naming convention
- 71c6ee1 ✨ app level alert/toast eventbus #188
- 3331407 ✨ deep and object i18n translate #184
- 7ebf3bb ✨ i18n common http status #184
- 101b735 ✨ alert queue and less fetch args #182
- 53c4604 🎨 ignore response error and handle status #180
- 929fbf6 ♻️ auto accept header for fetch/devProxy #178

## 0.5.11

- 8bb5561 🐛 been declared, when export class #173
- a373911 ✨ global toast,alert capturer #170
- 59b2d31 ⬆️ bump sentry
- ae0fced ♻️ Type Guard instead of get util #168
- 1f989a6 ♻️ refactor subclass of PriorityHook #166
- 2d0b9ad 🔖 error handling and notice input
- 391660c ✅ input validate and error capture #166
- f6f2bd9 ✨ common notice demo #164
- d9a8161 ✨ common notice, demoplay, up deps #164
- 05e02fa ✨ common notice captured #164
- 1ccdb9e ✨ global and dynamic i18n #10
- 345a4a1 ✨ consola as common logging #82
- 04a3605 ✨ rehook and warp vue:error #161
- cce9c22 ✨ useThrownCaptured manually hook #158
- 654f169 ✨ more Thrown class and fix tsc-type #157
- 41bcafe ✨ XxxThrown is not Error but throw #157
- f827b5e ✨ global result and errors #157
- e99aad8 💥 pre/post error handling in fetcher #147
- 2b0b6ed ✨ 🌕 sentry collects errors in the end #147
- b682167 ♻️ array of onResponse hook to handle response #155
- c973dee ♻️ remove sync fetch, global DataResult, rename xxxAsync to xxx

## 0.4.5

- f65d091 💚 asdf + corepack + .nvmrc #145
- fa7b4eb ✨ NumberLike support Infinity
- 8ba188f ✨ merge hooks option by call #132
- a82b482 ✨ handle 401 return false dataresult #132
- 1735919 ♻️ fetcher can handle the return #139

## 0.3.14

- 4ae4465 ✨ onClickOut or onEscKey to handle modal #137
- 339e49d ✨ refactor ionfetch with biz error #135
- d68aeb4 ✨ default options to handle 401,403 #132
- 1d4ca29 ♻️ typesafe use of any and object #130
- bc04d02 ♻️ ionicFetch with ref or fun
- 2efd652 ✨ formated type of float/long/data/time #127
- 57861f5 ✨ safeNumber and safeInt #126
- 2fb9612 ✨ ionicValidateInput support default v-model value #122
- f81e44c ✨ unocss transformer and lint #119
- 7b6934f ✨ global type of uno.config.mjs #115
- bf71b9d ✨ merge unocss once in layers #115
- df694fc ✨ unocss rules/shortcut of ion-popup #113
- cbd7e1f ✨ common boolean convertor #112
- 8d1b7f4 ⬆️ refine deps and devDeps #110
- d237bc6 ✨ element scroll align and promise

## 0.2.7

- bc407af ✨ add IonAlertDismiss type #108
- d1d829e ➕ add @ionic/core, up deps
- 6ec1a1a 🐛 down typescript from 5.7.2 to 5.6.3 #106
- 1f0a09b ✨ add OrElse util type, ionic tabs
- e3002f7 ✅ play active tab by route
- c9f4dda ⬆️ deps minor: vueuse,eslint,ts @nuxt/eslint
- a2870de ✨ useIonRoute() for workaround #104
- 35f0bd1 ✨ Maybe<T> is null | undefined | T #102
- b9cb302 ✨ safeValue converter
- a453d6b ✨ safeArray converter
- 26d842e ✨ useApiRoute composables #97
- e5590c8 ⬆️ up pnpm to fix bug, add vite for peer
- f0f0f73 ♻️ runtimeConfig + .env defines ApiRoute,ApiProxy #94
