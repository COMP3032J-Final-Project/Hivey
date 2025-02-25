#!/usr/bin/env sh

systemctl disable --now hivey-front-end 2>/dev/null
rm -f /usr/lib/systemd/system/hivey-front-end.service
cp -f /var/www/hivey/frontend/__misc/conf/hivey-front-end.service /usr/lib/systemd/system/hivey-front-end.service
systemctl daemon-reload
systemctl enable --now hivey-front-end
