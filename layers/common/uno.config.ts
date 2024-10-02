import { defineConfig } from 'unocss';
import presetIcons from '@unocss/preset-icons';
import presetWind from '@unocss/preset-wind';

export default defineConfig({
  presets: [presetWind(), presetIcons()],
});
