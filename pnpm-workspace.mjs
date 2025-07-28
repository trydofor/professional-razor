// check-core-compat.mjs
// Example annotation: # check:nuxt | https://github.com/xxx/xxx/blob/main/package.json
// Three supported formats for check target:
// - check:.          → compare current pkg in workspace with same name in remote file
// - check:.@foo/bar  → compare current pkg in workspace, but @foo/bar in remote file
// - check:nuxt       → compare 'nuxt' in workspace against its version in remote file

import fs from 'fs'
import path from 'path'
import semver from 'semver'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const yamlPath = path.resolve(__dirname, 'pnpm-workspace.yaml')
const lines = fs.readFileSync(yamlPath, 'utf-8').split(/\r?\n/)

const workspacePkgs = {}
const checkDeps = []
const githubCache = new Map()

// Extract all "pkg": "version" pairs from the file (rough YAML match)
for (const line of lines) {
  const pkgVer = line.match(/^\s+["']?([^"']+)["']?\s*:\s*["']?([^"']+)["']?/)
  if (!pkgVer) continue

  const [, pkg, ver] = pkgVer
  workspacePkgs[pkg] = ver

  const checkMark = line.match(/#\s*check:\s*([^|]+)\|\s*(https:\/\/\S+)/i)
  if (checkMark) {
    const [, depsRaw, url] = checkMark
    const deps = depsRaw.split(',').map(s => s.trim())
    checkDeps.push({ pkg, deps, url })
  }
}

async function fetchGithubJson(url) {
  const cached = githubCache.get(url)
  if (cached) return cached

  const rawUrl = url.replace(
    /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\//,
    'https://raw.githubusercontent.com/$1/$2/'
  )

  const res = await fetch(rawUrl)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`)

  let pkgs = null
  if (rawUrl.endsWith('.json')) {
    const meta = await res.json()
    pkgs = { ...meta.peerDependencies, ...meta.devDependencies, ...meta.dependencies }
  } else {
    const text = await res.text()
    const lines = text.split(/\r?\n/)
    pkgs = {}
    for (const line of lines) {
      const pkgVer = line.match(/^\s+["']?([^"']+)["']?\s*:\s*["']?([^"']+)["']?/)
      if (pkgVer) {
        const [, pkg, ver] = pkgVer
        pkgs[pkg] = ver
      }
    }
  }

  githubCache.set(url, pkgs)
  return pkgs
}

async function checkAll() {
  let passCount = 0
  let failCount = 0
  const results = []

  for (const { pkg, deps, url } of checkDeps) {
    const meta = await fetchGithubJson(url).catch(err => {
      console.warn(`⚠️  Failed to fetch ${url}: ${err.message}`)
      return null
    })
    if (!meta) continue

    for (const dep of deps) {
      let expectedRange = null
      let localVersion = null
      let displaySource = ''

      if (dep === '.') {
        expectedRange = meta[pkg]
        localVersion = workspacePkgs[pkg]
        displaySource = `${pkg}`
      } else if (dep.startsWith('.')) {
        const name = dep.slice(1)
        expectedRange = meta[name]
        localVersion = workspacePkgs[pkg]
        displaySource = `${pkg} → ${name}`
      } else {
        expectedRange = meta[dep]
        localVersion = workspacePkgs[dep]
        displaySource = `${pkg} checks ${dep}`
      }

      if (!expectedRange || !localVersion) {
        console.warn(`⚠️  Missing data for ${displaySource}`)
        continue
      }

      const ok = semver.satisfies(localVersion, expectedRange)
      const mark = ok ? '✅' : '❌'
      results.push(`${mark} ${displaySource.padEnd(50)} expected ${expectedRange.padEnd(12)} actual ${localVersion}`)
      if (ok) passCount++
      else failCount++
    }
  }

  console.log('\n=== Compatibility Report ===\n')
  for (const r of results) console.log(r)
  console.log(`\nSummary: ✅ ${passCount} compatible, ❌ ${failCount} incompatible\n`)
}

checkAll()
