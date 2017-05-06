#!/bin/bash

set -eu

DIR=log.sugarshin.net
NOW=$(date '+%F')
BRANCH=$NOW-monthly-report
TITLE="Monthly report $NOW"

[ -d $DIR ] || git clone git@github.com:sugarshin/$DIR.git $DIR
cd $DIR
git checkout -b $BRANCH || git checkout $BRANCH
git pull origin $BRANCH || true
yarn
npm run mr
git add --all
git commit -m "$TITLE"
git push origin HEAD:$BRANCH
cd -
npm run create-pull-request -- -b $BRANCH -t "$TITLE"
npm run merge-pull-request -- -b $BRANCH
