#!/usr/bin/env bash

# Lancer la construction de l'image docker.
# Passe en argument la clé publique de la machine hote (qui doit du coup avoir github dans ses "known_hosts" pour permettre le clonage des repos nécessaires depuis github depuis le container
docker build --tag=registry.okina.fr/mosaic/ninkasi:$1 --force-rm=true . --build-arg SSH_KEY="$(cat ~/.ssh/id_rsa)"
