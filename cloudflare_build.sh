#!/bin/bash

if [ "$WORKERS_CI_BRANCH" == "main" ]; then
  export CONVEX_DEPLOY_KEY=$CONVEX_DEPLOY_KEY_PROD && pnpx convex deploy --cmd 'pnpm opennextjs-cloudflare build'
else
  export CONVEX_DEPLOY_KEY=$CONVEX_DEPLOY_KEY_DEV && pnpx convex deploy --cmd 'pnpm opennextjs-cloudflare build'
fi
