const pnpmfile = {};
try {
  const hoist = require('pnpm-hoist-layer');
  pnpmfile.hooks = hoist.hooks;
  console.info('✅ pnpm-hoist-layer is', hoist.version);
} catch {
  console.warn('⚠️ pnpm-hoist-layer not found, reinstall to enable layer hoisting.');
}
module.exports = pnpmfile;
