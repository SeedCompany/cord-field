#!/usr/bin/env bash
# Creates the entire stack with docker to verify Dockerfile
set -ex

COMPOSE_FILE="docker/verify.yml"

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. ${DIR}/_functions.sh

yarn run docker:build

pull
trap down EXIT
compose up
