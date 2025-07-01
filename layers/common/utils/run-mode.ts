export const RunMode = {
  Product: 'Product',
  Test: 'Test',
  Develop: 'Develop',
  Local: 'Local',
  Nothing: 'Nothing',
} as const;

export type RunModeKey = keyof typeof RunMode;
export type RunModeType = typeof RunMode[RunModeKey];

/**
 * guess runmode by indexing string
 */
export function guessRunMode(str: string | undefined | null, index = 0): RunModeType | null {
  if (str) {
    const lc = str.toLowerCase();
    const mp = {
      prod: RunMode.Product,
      prd: RunMode.Product,
      test: RunMode.Test,
      tst: RunMode.Test,
      develop: RunMode.Develop,
      dev: RunMode.Develop,
      local: RunMode.Local,
      lcl: RunMode.Local,
    };
    for (const [key, mode] of Object.entries(mp)) {
      if (lc.includes(key, index)) {
        return mode;
      }
    }
  }
  return null;
}

/*
 * https://vite.dev/guide/env-and-mode.html
 */
export const envRunMode = guessRunMode(import.meta.env.MODE) ?? (import.meta.env.PROD ? RunMode.Product : (import.meta.env.DEV ? RunMode.Develop : RunMode.Nothing));
