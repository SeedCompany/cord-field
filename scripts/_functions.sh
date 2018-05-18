#!/usr/bin/env bash
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_NAME="$(basename ${PROJECT_DIR})"

function compose {
  docker-compose --project-name ${PROJECT_NAME} --file ${COMPOSE_FILE} $@
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

  compose pull ${remoteServices}
}
