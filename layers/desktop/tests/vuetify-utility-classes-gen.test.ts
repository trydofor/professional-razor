import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { it, expect } from 'vitest';
import { extractVuetifyClasses } from '../configures/vuetify-utility-classes-gen';

it('should match the generated blockMjs content with the existing output file', async () => {
  const expectedFile = fileURLToPath(import.meta.url).replace(
    /\/tests\/vuetify-utility-classes.*$/,
    '/configures/vuetify-utility-classes.mjs',
  );
  const expectedContent = await fs.readFile(expectedFile, 'utf-8');

  const { blockMjs } = await extractVuetifyClasses();

  expect(blockMjs).toBe(expectedContent);
});
