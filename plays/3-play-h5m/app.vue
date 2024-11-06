<template>
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
      <IonTabs @ion-tabs-did-change="onIonTabsDidChange">
        <IonRouterOutlet />
        <IonTabBar slot="bottom">
          <IonTabButton
            v-for="tb in tabs"
            :key="tb.tab"
            :tab="tb.tab"
            :href="tb.href"
          >
            <div :class="[tb.icon, 'text-3xl']" />
            <IonLabel>{{ tb.label }}</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonPage>
  </IonApp>
</template>

<script setup lang="ts">
const pageRoutes = useRouter().getRoutes().filter(it => it.path !== '/'); ;

function index(path: string) {
  return path.length > 3 ? path.substring(1, 3) : '00';
}

const tabs = reactive([
  {
    tab: 'main',
    label: 'Home',
    href: '/00-index',
    icon: 'i-mdi:home',
    iconActive: 'i-mdi:home',
    iconInactive: 'i-mdi:home-outline',
  },
  {
    tab: 'dpiimg',
    label: 'DpiImg',
    href: '/01-dpi-image',
    icon: 'i-mdi:image',
    iconActive: 'i-mdi:image',
    iconInactive: 'i-mdi:image-outline',
  },
  {
    tab: 'autosize',
    label: 'AutoSize',
    href: '/02-v-autosize',
    icon: 'i-mdi:animation',
    iconActive: 'i-mdi:animation',
    iconInactive: 'i-mdi:animation-outline',
  },
]);

function onIonTabsDidChange({ tab }: { tab: string }) {
  activeTab(tab);
}

function activeTab(tabOrRef: string) {
  console.log('>>>', tabOrRef);
  for (const tb of tabs) {
    if (tb.tab === tabOrRef || tb.href === tabOrRef) {
      tb.icon = tb.iconActive;
    }
    else {
      tb.icon = tb.iconInactive;
    }
  }
}
</script>
