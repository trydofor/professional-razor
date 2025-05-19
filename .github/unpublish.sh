#!/bin/bash -e

VER_EXPR=${1:-'dev'}
PKG_NAME=${2:-'@fessional/razor'}

echo "📦 Fetching package versions of $PKG_NAME"
VERSIONS=$(npm view "$PKG_NAME" versions --json | jq -r 'reverse | .[]')

echo "🔍 Matching versions regexp: $VER_EXPR"
MATCHED=$(echo "$VERSIONS" | grep -E "$VER_EXPR" || true)

if [ -z "$MATCHED" ]; then
  echo "✅ No matching versions found."
  exit 0
fi

echo '⚠️  //registry.npmjs.org/:_authToken=$NPM_TOKEN must set in ~/.npmrc'
echo "⚠️  Will attempt to unpublish the following versions:"
echo "$MATCHED"
echo ""

function _unpublish() {
  local pkg=$1
  npm unpublish "$pkg" > /dev/null 2>&1 && echo "  ✅ $pkg" || echo "  ❌ $pkg"
}

CONFIRM="no"
for version in $MATCHED; do
  if [[ "$CONFIRM" != "all" ]]; then
    read -p "🔆 Unpublish $version ? (all/y/n) " CONFIRM
    if [[ "$CONFIRM" != "y" && "$CONFIRM" != "all" ]]; then
      continue
    fi
  fi

  echo "🚮 Unpublish $version"
  _unpublish "$PKG_NAME@$version"
  _unpublish "${PKG_NAME}-common@$version"
  _unpublish "${PKG_NAME}-desktop@$version"
  _unpublish "${PKG_NAME}-mobile@$version"
done

echo "✅ Done All."
