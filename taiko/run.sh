#!/usr/bin/env sh

npm install
scripts/generate-certs.sh

npx taiko sfdc_login.js --observe