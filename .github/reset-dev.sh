#!/bin/bash -e
if [ -z "$1" ]; then
  git pull
  _df=$(git rev-parse --short HEAD^1)
  HL=$'\e[37;42;1m'
  git --no-pager log --oneline --graph  --decorate --color=always -n 10 \
  | sed "/${_df}/ s/.*/${HL}& <====/"

  echo -e "\033[37;42;1mWhich commit to reset to? ($_df)\033[0m"
  read _hash
  if [ -z "$_hash" ]; then
    _hash="$_df"
  fi
else
  _hash="$1"
  git --no-pager show --name-only $_hash
fi

echo -e "\033[37;42;1mMixed reset to $_hash, exclude package.json\033[0m"
read -p "Any key to continue, Ctrl+C to cancel"

_stash=false
if ! git diff --quiet; then
  git stash
  _stash=true
fi

git reset --mixed $_hash
git add 'package.json' '**package.json'
git restore .

if $_stash; then
  git stash pop
fi

echo -e "\n\n## $_tag\n\n"
git --no-pager log --invert-grep --grep='bumping versions' --grep='Merge pull request' --pretty=format:"- %h %s" $_tag..HEAD
echo
