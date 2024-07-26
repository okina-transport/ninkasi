#!/usr/bin/env bash

if [ $# -eq 1 ] && [ -z "$UPDATE_TYPE" ]; then
  UPDATE_TYPE=$1
fi

if [ -z "$UPDATE_TYPE" ]; then
  echo "UPDATE_TYPE is not set"
  exit 1
fi

# update project version
# then commit new "New develop version: {newVersion}
# Generate tag
TAG_NAME=$(npm version "$UPDATE_TYPE" -m "New develop version: %s")

if [ $? -ne 0 ]; then
  echo "Error generating tag"
	exit 1
fi

git push origin tag "$TAG_NAME"
git push

exit 0