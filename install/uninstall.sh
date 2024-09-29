#!/usr/bin/env bash
systemctl --user status deckwebview.service &>/dev/null && systemctl --user disable --now -f deckwebview.service
cd /home/deck/Applications &> /dev/null && rm -rf deckwebview
cd ~/.config/systemd/user && rm -rf deckwebview.service
systemctl --user daemon-reload