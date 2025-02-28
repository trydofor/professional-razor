<script lang="ts" setup>
const step = 50; // bottom is positive, top is negative
let toastOffset = 0;

async function presentToast(message: string) {
  const toast = await toastController.create({
    message,
    duration: 1500,
    icon: ioniconsAlertCircleOutline,
    position: 'bottom',
  });

  toastOffset -= step;
  toast.style.setProperty('margin-top', `${toastOffset}px`);

  toast.onDidDismiss().then(() => {
    toastOffset += step;
  });
  await toast.present();
}

async function presentAlert(message: string) {
  const alert = await alertController.create({
    header: 'Notice',
    message,
    buttons: ['OK'],
  });

  await alert.present();
};

// handle global notices
const { t } = useI18n();
globalNoticeCapturer.put({ id: 'AppNoticeThrown', order: 1000, hook: (ntc) => {
  const message = getLocaleMessage(ntc, t);
  if (!message) return;

  // no await
  const fun = (ntc.type === 'toast' ? presentToast : presentAlert);
  fun(message);
  return false;
} });

// handle global router changes
const router = useIonRouter();
globalThrownCapturer.put({ id: 'AppNavigateThrown', order: 3000, hook: (err) => {
  if (err instanceof NavigateThrown && err.route) {
    router.push(err.route);
    return false;
  }
} });
</script>
