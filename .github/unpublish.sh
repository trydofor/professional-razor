#!/bin/bash -e

VER_EXPR=${1:-'dev'}
PKG_NAME=${2:-'@fessional/razor'}
SUFFIXES=${3:-'common,desktop,mobile'}

echo "📦 Fetching versions for $PKG_NAME"

VERSIONS=$(curl -s "https://registry.npmjs.org/${PKG_NAME}" \
  | jq -r '[.versions | to_entries[] | select(.value.deprecated == null) | .key] | reverse[]')

echo "🔍 Matching versions using pattern: $VER_EXPR"
MATCHED=$(echo "$VERSIONS" | grep -E "$VER_EXPR" || true)

if [ -z "$MATCHED" ]; then
  echo "✅ No matching versions found."
  exit 0
fi

echo "⚠️  Requires auth token in ~/.npmrc: //registry.npmjs.org/:_authToken=\$NPM_TOKEN"
echo "⚠️  The following versions will be unpublished (or deprecated if not allowed):"
echo "$MATCHED"
echo ""

function _unpublish() {
  local pkg=$1
  if npm unpublish "$pkg" > /dev/null 2>&1; then
    echo "✅ Unpublished $pkg"
  else
    npm deprecate -f "$pkg" "❌ Deprecated version. Please upgrade." > /dev/null 2>&1
    echo "⚠️  Deprecated $pkg"
  fi
}

IFS=',' read -ra SUFFIX_LIST <<< "$SUFFIXES"

CONFIRM="no"
for version in $MATCHED; do
  if [[ "$CONFIRM" != "all" ]]; then
    read -p "🔆 Unpublish $version? (all/y/n) " CONFIRM
    if [[ "$CONFIRM" != "y" && "$CONFIRM" != "all" ]]; then
      continue
    fi
  fi

  echo "🚮 Processing $PKG_NAME@$version"
  _unpublish "$PKG_NAME@$version"

  for suffix in "${SUFFIX_LIST[@]}"; do
    if [[ -n "$suffix" && "$suffix" != "-" ]]; then
      _unpublish "${PKG_NAME}-${suffix}@$version"
    fi
  done
done

echo "✅ All done."
