#!/bin/bash -xe

## calculate version
pnpm exec changeset status --output version-status.tmp
_ver=$(jq -r '.releases[] | select(.name == "@fessional/razor-common") | .newVersion' version-status.tmp)

## replace version in top package.json, that changeset NOT do
sed_opt=(-i)
if [[ "$(uname)" == "Darwin" ]]; then
  sed_opt=(-i '')
fi
sed "${sed_opt[@]}" "s/\"version\": \".*\"/\"version\": \"$_ver\"/" package.json

## change version in sub package.json
pnpm exec changeset version
