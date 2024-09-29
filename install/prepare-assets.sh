#!/usr/bin/env bash
go build -ldflags "-X main.version=$VERSION" ../cmd/deckwebview/deckwebview.go
tar -czf $ARCHIVE deckwebview ../static ../install/deckwebview.service
cp install-template.sh install.sh
sed -i "s/--VERSION--/$VERSION/" install.sh
