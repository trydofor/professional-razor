#!/bin/bash

set -x -e
pnpm exec changeset status --output version-status.tmp
newv=$(jq -r '.releases[1].newVersion' version-status.tmp)

## replace version in package.json
if [[ "$(uname)" == "Darwin" ]]; then
  sed -i '' "s/\"version\": \".*\"/\"version\": \"$newv\"/" package.json
else
  sed -i "s/\"version\": \".*\"/\"version\": \"$newv\"/" package.json
fi

pnpm exec changeset version
