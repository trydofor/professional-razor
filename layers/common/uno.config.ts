import { defineConfig } from 'unocss';
import presetIcons from '@unocss/preset-icons';
import presetWind4 from '@unocss/preset-wind4';
import transformerDirectives from '@unocss/transformer-directives';
import transformerVariantGroup from '@unocss/transformer-variant-group';

export default defineConfig({
  presets: [presetWind4({ prefix: ['_', ''] }), presetIcons()],
  transformers: [
    /**
     * @apply --at-apply, @screen and theme()
     */
    transformerDirectives(),
    /**
     * hover:(bg-gray-400 font-medium)
     * hover:bg-gray-400 hover:font-medium
     */
    transformerVariantGroup(),
  ],
});
