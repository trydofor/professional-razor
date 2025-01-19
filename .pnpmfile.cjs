const pnpmfile = {};
try {
  pnpmfile.hooks = require('pnpm-hoist-layer').hooks;
} catch {
  console.warn('⚠️ "pnpm-hoist-layer" not found, retry after installing.');
}
module.exports = pnpmfile;
