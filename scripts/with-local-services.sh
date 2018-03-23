#!/usr/bin/env bash
# Create all dependant containers needed, runs the command given via args, then tears the containers down.
set -ex

COMPOSE_FILE="docker/local.yml"

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. ${DIR}/_functions.sh

pull
compose up -d
trap down EXIT
$@
