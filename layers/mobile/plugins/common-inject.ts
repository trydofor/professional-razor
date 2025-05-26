import { CapacitorStorage } from '../utils/app-inject';

export default defineNuxtPlugin({
  name: 'common-inject-plugin',
  enforce: 'pre',
  setup() {
    logger.info('common-inject-plugin - ' + CapacitorStorage._id);
  },
});
