#!/usr/bin/env bash
# Runs the test suite inside of a docker container.
set -ex;

COMPOSE_FILE="docker/test-bamboo.yml"

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. ${DIR}/_functions.sh

yarn run docker:build:tests

pull
trap down EXIT

compose run local-test-service
