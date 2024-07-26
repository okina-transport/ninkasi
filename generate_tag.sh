#!/usr/bin/env bash
set -ex
if [ $# -eq 1 ]; then
  UPDATE_TYPE=$1
fi
TAG_NAME=$(npm version "$UPDATE_TYPE" -m "New develop version: %s")
git push
git push origin tag "$TAG_NAME"
exit 0
