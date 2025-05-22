import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const cssPaths = [
  'node_modules/vuetify/dist/vuetify.css',
  'node_modules/vuetify/dist/vuetify-labs.css',
];

const classPrefix = [
  'border', // https://vuetifyjs.com/en/styles/borders/#usage
  'rounded', // https://vuetifyjs.com/en/styles/border-radius/#usage
  'cursor', // https://vuetifyjs.com/en/styles/cursor/#usage
  'd-', // https://vuetifyjs.com/en/styles/display/#usage
  'elevation', // https://vuetifyjs.com/en/styles/elevation/#usage
  'flex-', 'ga-', 'justify-', 'align-', 'order-', // https://vuetifyjs.com/en/styles/flex/#usage
  'float-', // https://vuetifyjs.com/en/styles/float/#usage
  'opacity-', // https://vuetifyjs.com/en/styles/opacity/#usage
  'overflow', // https://vuetifyjs.com/en/styles/overflow/#usage
  'position-', 'top-', 'right-', 'bottom-', 'left-', // https://vuetifyjs.com/en/styles/position/#usage
  'h-', 'fill-', 'height-', 'w-', // https://vuetifyjs.com/en/styles/sizing/#usage
  'ma-', 'ml-', 'ms-', 'mt-', 'mr-', 'me-', 'mb-', // https://vuetifyjs.com/en/styles/spacing/#usage
  'pa-', 'pl-', 'ps-', 'pt-', 'pr-', 'pe-', 'pb-', // https://vuetifyjs.com/en/styles/spacing/#usage
  'text-', // https://vuetifyjs.com/en/styles/text-and-typography/#usage
];

export function extractClassNames(css: string, prefixes: string[]): string[] {
  const classRegex = /\.([a-zA-Z0-9\-_\\:]+)[\s,{]/g;
  const classSet = new Set<string>();

  let match;
  while ((match = classRegex.exec(css)) !== null) {
    const className = match[1].replace(/\\:/g, ':');
    if (prefixes.some(p => className.startsWith(p))) {
      classSet.add(className);
    }
  }

  return [...classSet].sort();
}

export function generateBlockMjs(classArr: string[]): string {
  return `
// generate by generate-vuetify-utility-class.ts
export default [
  ${classArr.map(it => `'${it}'`).join(',\n  ')},
];
`.trimStart();
}

export async function extractVuetifyClasses(): Promise<{
  classArr: string[];
  blockMjs: string;
}> {
  const combinedCss = await Promise.all(
    cssPaths.map(async p => fs.readFile(path.resolve(p), 'utf-8')),
  ).then(contents => contents.join('\n'));

  const classArr = extractClassNames(combinedCss, classPrefix);
  const blockMjs = generateBlockMjs(classArr);
  return { classArr, blockMjs };
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const blockOut = fileURLToPath(import.meta.url).replace(/-[^-]+$/, '.mjs');
  const { classArr, blockMjs } = await extractVuetifyClasses();
  await fs.writeFile(blockOut, blockMjs);
  console.log(`✅ Extracted ${classArr.length} Vuetify classes to ${blockOut}`);
}
