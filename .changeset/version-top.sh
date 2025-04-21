#!/bin/bash -xe

## change version in sub package.json
pnpm exec changeset version

## update version in top package.json
_top=package.json
_sub=layers/common/package.json
_old=$(jq -r '.version' "$_top")
_new=$(jq -r '.version' "$_sub")

if [[ "$_old" == "$_new" ]]; then
  echo "✅ version is the same: $_old"
  exit 0
fi

echo "🔄 Updating top package version from $_old to $_new"
sed_opt=(-i)
if [[ "$(uname)" == "Darwin" ]]; then
  sed_opt=(-i '')
fi
sed "${sed_opt[@]}" "s/\"version\": \"$_old\"/\"version\": \"$_new\"/" "$_top"
#git diff "$_top"
