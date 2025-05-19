#!/bin/bash -e

# Optional: how many tags to include (default: all)
LIMIT=${1:-3}

# Get all tags sorted by creation date (newest first)
tags=$(git tag --sort=-creatordate)
revi=()

# Check if HEAD is tagged
head_tag=$(git tag --points-at HEAD)
if [ -z "$head_tag" ]; then
  # If HEAD is not tagged, treat it as "Unreleased"
  revi+=("HEAD")
fi

# Add all tags to the list (newest first)
while IFS= read -r tag; do
  revi+=("$tag")
done <<< "$tags"

# Limit to N entries if specified and > 0
if [ "$LIMIT" -gt 0 ]; then
  revi=("${revi[@]:0:$LIMIT+1}")
fi
echo "Limit: $LIMIT"
echo "Commits: ${revi[@]}"

# Loop through tag pairs and generate changelog sections
for ((i=0; i<${#revi[@]}-1; i++)); do
  new_tag="${revi[$i]}"
  old_tag="${revi[$i+1]}"
  # Print section header with a blank line before
  [[ "$new_tag" == "HEAD" ]] && echo -e "\n\n## Unreleased\n\n" || echo -e "\n\n## $new_tag\n\n"
  git --no-pager log --invert-grep --grep='bumping versions' --grep='Merge pull request' --pretty=format:"- %h %s" "$old_tag..$new_tag"
done

# If only one entry (e.g. HEAD only, or last tag), output commits since it
if [ "${#revi[@]}" -eq 1 ]; then
  echo -e "\n\n## ${revi[0]}\n\n"
  git --no-pager log --invert-grep --grep='bumping versions' --grep='Merge pull request' --pretty=format:"- %h %s" "${revi[0]}"
fi

echo -e "\n\n"
