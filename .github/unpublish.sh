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

CONFIRM="no"
for version in $MATCHED; do
  if [[ "$CONFIRM" != "all" ]]; then
    read -p "🔆 Unpublish $PKG_NAME@$version ? (all/yes/no) " CONFIRM
    if [[ "$CONFIRM" != "yes" && "$CONFIRM" != "all" ]]; then
      continue
    fi
  fi
  echo "🚮 Unpublish $PKG_NAME@$version"
  npm unpublish "$PKG_NAME@$version"
  npm unpublish "${PKG_NAME}-common@$version"
  npm unpublish "${PKG_NAME}-mobile@$version"
done

echo "✅ Done."
