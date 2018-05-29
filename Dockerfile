FROM node:8

RUN set -ex; \
    mkdir -p /opt/build; \
    \
    apt-get update && \
    DEBIAN_FRONTEND="noninteractive" \
    apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/build

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

ARG NG_BUILD_TARGET
ARG GIT_HASH

RUN set -e; \
  echo ${GIT_HASH:-"unknown"} > src/git.txt; \
  # Build angular client bundles
  yarn ng build --prod --environment $NG_BUILD_TARGET --progress=false; \
  # Build angular server bundles
  yarn ng build --app 1 --prod --environment $NG_BUILD_TARGET --progress=false --output-hashing=false; \
  # Build web server
  yarn webpack --config webpack.server.config.js --colors;

COPY docker/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD PORT=80 node dist/server
