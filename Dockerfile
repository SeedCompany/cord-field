FROM node:slim

RUN set -ex; \
    useradd -r nginx; \
    \
    mkdir -p /var/log/nginx/log/; \
    mkdir -p /opt/build; \
    \
    apt-get update && \
    DEBIAN_FRONTEND="noninteractive" \
    apt-get install -y --no-install-recommends \
      nginx \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/share/nginx/html

COPY ./docker/nginx.conf /etc/nginx

RUN set -ex; \
    yarn global add @angular/cli;

COPY package.json /opt/build
COPY yarn.lock /opt/build

RUN set -ex; \
    cd /opt/build; \
    yarn install; \
    yarn list --depth=0

ARG NG_BUILD_TARGET
ARG GIT_HASH

COPY . /opt/build
RUN set -ex; \
    cd /opt/build; \
    echo ${GIT_HASH:-"unknown"} > src/git.txt; \
    ng build --environment $NG_BUILD_TARGET --progress=false; \
    cp -R ./dist/* /usr/share/nginx/html; \
    cd /usr/share/nginx/html; \
    rm -rf /opt/build; \
    chown -R nginx:nginx /usr/share/nginx/html

COPY docker/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
	&& ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80
STOPSIGNAL SIGQUIT

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
