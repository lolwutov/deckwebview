#!/usr/bin/env bash
export VERSION=$(date -I).$(git rev-parse --short HEAD)
export ARCHIVE=deckwebview.tar.xz
export INSTALL_SCRIPT=install.sh
export UNINSTALL_SCRIPT=uninstall.sh
export REPNAME=deckwebview

./prepare-assets.sh

RESP=$(curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/lolwutov/$REPNAME/releases \
  -d "{\"tag_name\":\"${VERSION}\",\"target_commitish\":\"main\",\"name\":\"${VERSION}\",\"body\":\"\"}")


export RID=$(echo $RESP | jq '.["id"]')

./upload-asset.sh $ARCHIVE
./upload-asset.sh $INSTALL_SCRIPT
./upload-asset.sh $UNINSTALL_SCRIPT