import { Preferences } from '@capacitor/preferences';
import type { StorageLikeAsync } from '@vueuse/core';

export const CapacitorStorage = {
  _id: 'CapacitorStorage',
  getItem: (key: string) => Preferences.get({ key }).then(it => it.value),
  setItem: (key: string, value: string) => Preferences.set({ key, value }),
  removeItem: (key: string) => Preferences.remove({ key }),
} as StorageLikeAsync & { _id: string };

globalProvide(StorageLikeAsyncInjectKey, CapacitorStorage, true);
