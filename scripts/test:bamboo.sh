#!/usr/bin/env bash
# Runs the test suite inside of a docker container.
set -ex;

COMPOSE_FILE="docker/test-bamboo.yml"

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. ${DIR}/_functions.sh

scripts/docker:build:tests.sh ${1:-local}

TAG=${1:-local} pull
trap down EXIT

TAG=${1:-local} compose run local-test-service
