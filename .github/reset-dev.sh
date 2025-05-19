#!/bin/bash -e

git pull
#git --no-pager tag | tac | head -n 5
git --no-pager tag | tail -n 5
echo -e "\033[37;42;1mWhich tag to show from?\033[0m"
read _tag

git --no-pager log --oneline --graph --all $_tag..HEAD
echo -e "\033[37;42;1mWhich commit to reset to?\033[0m"
read _hash
if [ -z "$_hash" ]; then
  _hash=$(git rev-parse --short HEAD^1)
  echo "use HEAD^1 by default $_hash"
fi

read -p "Any key to continue, Ctrl+C to cancel"

echo "Mixed reset to $_hash, exclude package.json"

git reset --mixed $_hash
git add 'package.json' '**package.json'
git restore .

echo -e "\n\n## $_tag\n\n"
git --no-pager log --invert-grep --grep='bumping versions' --grep='Merge pull request' --pretty=format:"- %h %s" $_tag..HEAD
echo
