#!/usr/bin/env bash

set -ex;
yarn run docker:build:tests
docker-compose --file docker/docker-test-bamboo.yml  \
  run test-service  \
  ng test --watch=false --browsers=docker --config karma.bamboo.conf.js --sourcemap --progress=false

docker-compose --file docker/docker-test-bamboo.yml down --remove-orphans
