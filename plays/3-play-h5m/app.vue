<template>
  <GlobalThrownCapturer>
    <IonApp>
      <IonMenu content-id="main-content" side="end">
        <IonHeader>
          <IonMenuToggle>
            <IonToolbar>
              <IonButtons slot="end">
                <IonButton>
                  <div class="i-mdi-close text-3xl text-primary" />
                </IonButton>
              </IonButtons>
              <IonTitle>Menu Title</IonTitle>
            </IonToolbar>
          </IonMenuToggle>
        </IonHeader>
        <IonContent>
          <IonMenuToggle>
            <IonList>
              <IonItem
                v-for="rt in pageRoutes"
                :key="rt.path"
                :button="true"
                :router-link="rt.path"
              >
                <IonLabel>
                  {{ index(rt.path) }} - {{ rt.name }}
                </IonLabel>
              </IonItem>
            </IonList>
          </IonMenuToggle>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonTabs>
          <IonRouterOutlet />
          <IonTabBar slot="bottom">
            <IonTabButton
              v-for="(tb, ix) in tabs"
              :key="'tab' + ix"
              :disabled="tb.href === ''"
              :tab="'tab' + ix"
              :href="tb.href"
              :selected="tb.on"
            >
              <div :class="[tb.on ? tb.classOn : tb.classOff, 'text-3xl']" />
              <IonLabel>{{ tb.label }}</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonPage>
    </IonApp>
  </GlobalThrownCapturer>
</template>

<script setup lang="ts">
const router = useRouter();
const pageRoutes = router.getRoutes().filter(it => it.path !== '/'); ;

function index(path: string) {
  return path.length > 3 ? path.substring(1, 3) : '00';
}

const tabs = reactive([
  {
    label: 'Home',
    href: '/',
    on: true,
    classOn: 'i-mdi:home',
    classOff: 'i-mdi:home-outline',
  },
  {
    label: 'DpiImg',
    href: '/01-dpi-image',
    on: false,
    classOn: 'i-mdi:image',
    classOff: 'i-mdi:image-outline',
  },
  {
    label: 'Latest',
    href: '/02-v-autosize',
    on: false,
    classOn: 'i-mdi:lightbulb-on',
    classOff: 'i-mdi:lightbulb-on-10',
  },
]);

// https://ionicframework.com/docs/vue/navigation#working-with-tabs
router.afterEach((to) => {
  const t = to.path.startsWith('/00') ? '/' : to.path;
  if (t !== tabs[0].href && t !== tabs[1].href) {
    tabs[2].href = t;
    tabs[2].label = 'No#' + index(t);
  }
  for (const tb of tabs) {
    tb.on = t === tb.href;
  }
});

globalThrownCapturer.put({ id: 'GlobalSentryErrorNotice', order: 8000, hook: (err: SafeAny) => {
  globalNoticeCapturer.call({
    message: 'this error will sent to sentry, check log',
  });
  logger.error('this error will sent to sentry', err);
} });
</script>
