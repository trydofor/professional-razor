const packageKey = 'hoistLayer';
const cachedFile = 'node_modules/.hoist-layer.json';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// find the monorepo root by searching for .pnpmfile.cjs
function findMonorepoRoot(pwd) {
  if (fs.existsSync(path.join(pwd, '.pnpmfile.cjs'))) {
    return pwd;
  }
  const dir = path.dirname(pwd);
  if (dir === pwd) {
    throw new Error('Monorepo root not found, should have .pnpmfile.cjs');
  }
  return findMonorepoRoot(dir);
}

const monorepoRoot = findMonorepoRoot(process.cwd());
const packageJson = path.resolve(monorepoRoot, 'package.json');
if (packageJson == null) {
  throw new Error('package.json is not found in ' + monorepoRoot);
}

const flatLayerMap = new Map();
const hoistLayer = JSON.parse(fs.readFileSync(packageJson, 'utf-8'))[packageKey]; // string[]
if (hoistLayer == null) {
  throw new Error('"hoistLayer":[""] is not defined in package.json');
}
// console.log('DEBUG: hoistLayer \n' + JSON.stringify(hoistLayer, null, 2));

const cachedPath = path.resolve(monorepoRoot, cachedFile);
const cacheExist = fs.existsSync(cachedPath);
const resolutionOnly = process.argv.includes('--resolution-only');
if (resolutionOnly && cacheExist) {
  fs.rmSync(cachedPath);
}
// console.log(`DEBUG: cachedPath=${cachedPath}`);
// console.log(`DEBUG: cacheExist=${cacheExist}`);
// console.log(`DEBUG: resolutionOnly=${resolutionOnly}`);
if (!resolutionOnly && cacheExist) {
  loadFlatLayer();
  // console.log('DEBUG: loadFlatLayer \n' + JSON.stringify(Array.from(flatLayerMap.values()), null, 2));
}

function loadFlatLayer() {
  const arr = JSON.parse(fs.readFileSync(cachedPath, 'utf-8'));
  if (arr == null) return;
  // set
  for (const pk of arr) {
    flatLayerMap.set(pk.name, pk);
  }

  // flat
  for (const pk of arr) {
    for (const k of flatLayerMap.keys()) {
      if (pk.dependencies[k] != null) {
        const it = flatLayerMap.get(k);
        pk.dependencies = {
          ...pk.dependencies,
          ...it.dependencies,
        };
      }
      if (pk.devDependencies[k] != null) {
        const it = flatLayerMap.get(k);
        pk.devDependencies = {
          ...pk.devDependencies,
          ...it.devDependencies,
        };
      }
    }
  }
}

function readPackage(pkg, context) {
  if (resolutionOnly) {
    if (hoistLayer.includes(pkg.name)) {
      context.log('find the hoist layers ' + pkg.name);
      flatLayerMap.set(pkg.name, {
        name: pkg.name,
        dependencies: pkg.dependencies,
        devDependencies: pkg.devDependencies,
      });
    }
    if (flatLayerMap.size === hoistLayer.length) {
      context.log('write cached hoist-layer to ' + cachedPath);
      fs.mkdirSync(path.dirname(cachedPath), { recursive: true });
      fs.writeFileSync(cachedPath, JSON.stringify(Array.from(flatLayerMap.values()), null, 2), 'utf-8');
      process.exit(0);
    }
    return pkg;
  }

  if (flatLayerMap.size === 0) {
    context.log('resolution the hoist layers');
    execSync('pnpm i --resolution-only', { stdio: 'ignore' });
    loadFlatLayer();
    if (flatLayerMap.size === 0) {
      throw new Error('failed to load layer package by pnpm i --resolution-only');
    }
  }

  // layer dependency
  for (const pk of hoistLayer) {
    if (pkg.dependencies[pk] != null || pkg.devDependencies[pk] != null) {
      context.log('hoist layer' + pk + ' to ' + pkg.name);
      const it = flatLayerMap.get(pk);
      pkg.dependencies = {
        ...pkg.dependencies,
        ...it.dependencies,
      };
      pkg.devDependencies = {
        ...pkg.devDependencies,
        ...it.devDependencies,
      };
    }
  }

  return pkg;
}

function afterAllResolved(lockfile) {
  if (resolutionOnly && flatLayerMap.size !== hoistLayer.length) {
    throw new Error('hoistLayer size is not equal to flatLayerMap size');
  }
  return lockfile;
}

module.exports = {
  packageKey,
  cachedFile,
  hooks: {
    readPackage,
    afterAllResolved,
  },
};
