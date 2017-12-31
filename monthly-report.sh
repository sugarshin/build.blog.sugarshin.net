#!/bin/bash

set -eu

DIR=log.sugarshin.net
MONTH=$(date '+%Y%m')
BRANCH=$MONTH$(date '+%d-%I%M')-monthly-report
TITLE="Monthly report $MONTH"
NAME=${CIRCLE_USERNAME:-'CircleCI'}

[ -d $DIR ] || git clone --depth=1 git@github.com:sugarshin/$DIR.git $DIR
cd $DIR
git checkout -b $BRANCH || git checkout $BRANCH
git pull --depth=1 origin $BRANCH || true
yarn
npm run mr -- -p 31 -u minutes -n $NAME -U $CIRCLE_BUILD_URL
git add --all
git commit -m "$TITLE"
git push origin HEAD:$BRANCH
cd -
npm run create-pull-request -- -b $BRANCH -t "$TITLE"
npm run merge-pull-request -- -b $BRANCH
