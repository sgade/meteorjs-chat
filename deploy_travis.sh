#!/bin/sh

URL=ce-bt-chat.meteor.com
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  URL=ce-bt-chat-$TRAVIS_PULL_REQUEST.meteor.com
fi

echo "jh.bruhn@me.com" | meteor deploy $URL
