#!/bin/bash -xe

## `changeset publish` Tagging and releasing each package is too much

_tag=latest
# tags that do not begin with a number or the letter v.
if [ -f .changeset/pre.json ]; then
  _tag=$(jq -r '.tag' .changeset/pre.json)
fi

#pnpm -r publish --access public --tag "$_tag" --report-summary --dry-run --no-git-checks
pnpm -r publish --access public --tag "$_tag" --report-summary

## simulate https://github.com/changesets/action/blob/31ff97e8acd3cfd08714eab3721f55da10003255/src/run.ts#L139
## 🦋  New tag:  @fessional/razor-mobile@0.1.24
jq -r '.publishedPackages[] | select(.name != "@fessional/razor") | "🦋  New tag:  \(.name)@\(.version)"' pnpm-publish-summary.json

rm -rf pnpm-publish-summary.json
