import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentsPath = resolve(__dirname, '../.nuxt/components.d.ts');

// Read and parse component definition file
const content = readFileSync(componentsPath, 'utf-8');
const ionMatches = [...content.matchAll(/export\s+const\s+(Ion\w+):\s+typeof\s+import\("@ionic\/vue"\)\['\1'\]/g)];
const ionComponents = ionMatches.map(match => match[1]);
console.log('ignore Ionic components: ', JSON.stringify(ionComponents));

// Generate component names with Lazy prefix
const lazyIonComponents = ionComponents.map(name => `Lazy${name}`);

// Merge all components to be ignored
const allComponents = [...ionComponents, ...lazyIonComponents];

export const rules = {
  'vue/no-deprecated-slot-attribute': ['error', { ignore: allComponents }],
};

const config = { files: ['**/*.vue'], rules };

export default config;
