<script lang="ts" setup>
import type { AlertOptions, ToastOptions } from '@ionic/vue';

const step = 50; // bottom is positive, top is negative
let toastOffset = 0;

async function presentToast(message: string | ToastOptions) {
  const opts: ToastOptions = typeof message === 'string'
    ? {
        message,
        duration: 1500,
        icon: ioniconsAlertCircleOutline,
        position: 'bottom',
      }
    : message;
  const toast = await toastController.create(opts);

  toastOffset -= step;
  toast.style.setProperty('margin-top', `${toastOffset}px`);

  toast.onDidDismiss().then(() => {
    toastOffset += step;
  });
  await toast.present();
}

async function presentAlert(message: string | AlertOptions) {
  const opts: AlertOptions = typeof message === 'string'
    ? {
        header: 'Notice',
        message,
        buttons: ['OK'],
      }
    : message;
  const alert = await alertController.create(opts);
  await alert.present();
};

// handle global notices
const { t } = useI18n();
globalNoticeCapturer.put({ id: 'AppNoticeThrown', order: 1000, hook: (ntc) => {
  const message = localizeMessage(ntc, t);
  if (!message) return;

  // no await
  const fun = (ntc.type === 'toast' ? presentToast : presentAlert);
  fun(message);
  return false;
} });

// handle global router changes
const router = useIonRouter();
globalThrownCapturer.put({ id: 'AppNavigateThrown', order: 3000, hook: (err) => {
  if (isNavigateThrown(err) && err.route) {
    router.push(err.route);
    return false;
  }
} });

globalThrownCapturer.put({ id: 'AlertToastDataThrow', order: 4000, hook: (err) => {
  if (isDataThrown(err)) {
    if (err.type === 'Alert') {
      presentAlert(err.data);
      return false;
    }
    if (err.type === 'Toast') {
      presentToast(err.data);
      return false;
    }
  }
} });
</script>
