#!/usr/bin/env bash
VERSION=--VERSION--
URL="https://github.com/lolwutov/deckwebview/releases/download/$VERSION"
ARCHIVE=deckwebview.tar.xz
APPURL="$URL/$ARCHIVE"
UNINSTURL="$URL/uninstall.sh"
APPDIR=/home/deck/Applications/deckwebview

wget -O - $UNINSTURL -nv | bash
mkdir -p "${APPDIR}" &&\
cd "${APPDIR}" &&\
wget $APPURL -nv &&\
tar -xzf $ARCHIVE &&\
rm $ARCHIVE &&\
mv ./install/deckwebview.service /home/deck/.config/systemd/user &&\
rm -rf install
systemctl --user daemon-reload &&\
systemctl --user enable --now deckwebview.service
echo "deckwebview installed"