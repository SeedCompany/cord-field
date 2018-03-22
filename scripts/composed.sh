#!/usr/bin/env bash
set -ex

docker pull 103805181946.dkr.ecr.us-west-2.amazonaws.com/client/tsco-ilb-profile:latest

docker volume prune -f || echo "skipped docker volume prune"
docker-compose --file docker/local.yml up -d --remove-orphans

function down {
  docker-compose --file docker/local.yml down
}
trap 'down' SIGINT

$@

down
