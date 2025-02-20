import { LogLevels } from 'consola';

export default defineNuxtPlugin({
  name: 'logging-config-plugin',
  enforce: 'pre',
  setup() {
    const newLevel = useRuntimeConfig().public.loggerLevel as keyof typeof LogLevels;
    const oldValue = logger.level;
    const oldLevel = Object.entries(LogLevels).find(([_, v]) => v === oldValue)?.[0] ?? oldValue;

    if (!newLevel) {
      logger.info('current loglevel %s(%d)', oldLevel, oldValue);
      return;
    }
    if (!(newLevel in LogLevels)) {
      throw new Error(`Invalid logger level: ${newLevel}, check https://github.com/unjs/consola/blob/main/src/constants.ts`);
    }

    const newValue = LogLevels[newLevel];
    logger.info('change loglevel from %s(%d) to %s(%d)', oldLevel, oldValue, newLevel, newValue);
    logger.level = newValue;
  },
});
