#!/usr/bin/env bash

function compose {
  docker-compose --file ${COMPOSE_FILE} $@
}

function down {
  compose down --remove-orphans
  docker volume prune -f || echo "skipped docker volume prune"
}

function pull {
  local services
  local remoteServices
  services=$(compose config --services)
  remoteServices=""
  for service in ${services[@]}; do
    if [[ ${service} != local-* ]]; then
      remoteServices+=" $service"
    fi
  done

  compose pull --parallel ${remoteServices}
}
