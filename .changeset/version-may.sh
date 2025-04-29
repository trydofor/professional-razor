#!/bin/bash -xe

if pnpm exec changeset status --output version-status.tmp; then
  jq -r '.releases[1].newVersion' version-status.tmp
else
  jq -r '.version' layers/common/package.json
fi
