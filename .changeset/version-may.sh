#!/bin/bash -xe

if pnpm exec changeset status --output version-status.tmp > /dev/null 2>&1; then
  jq -r '.releases[1].newVersion' version-status.tmp
else
  jq -r '.version' layers/common/package.json
fi
