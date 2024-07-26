#!/usr/bin/env bash

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

# Lancer la construction de l'image docker.
docker build --tag=registry.okina.fr/mobiiti/ninkasi:${PACKAGE_VERSION} --force-rm=true .
docker push registry.okina.fr/mobiiti/ninkasi:${PACKAGE_VERSION}
