#!/bin/sh

branch="$(git rev-parse --abbrev-ref HEAD)"

if [ "$branch" = "master" ]; then
  echo "You can't commit directly to master branch"
  echo "\033[0;31m NOTHING WAS COMMITTED \033[0m"
  exit 1
fi

