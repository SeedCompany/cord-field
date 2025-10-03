FROM public.ecr.aws/docker/library/node:24-slim as node

RUN <<EOF
set -e

apt-get update

# Install wget/curl for health checks
apt-get install -y --no-install-recommends ca-certificates wget curl

# Clean up cache to reduce image size
apt-get clean -q -y
rm -rf /var/lib/apt/lists/*

corepack enable

EOF

WORKDIR /app
ENV NODE_ENV=production

FROM node AS builder

# Install dependencies (in separate docker layer from app code)
COPY .yarn .yarn
COPY package.json yarn.lock .yarnrc.yml ./
ENV VERBOSE_YARN_LOG=discard \
    # Use the local cache folder so libs are correctly copied in runtime stage
    YARN_ENABLE_GLOBAL_CACHE=false
RUN yarn install --immutable

COPY . .

ARG API_BASE_URL
ENV RAZZLE_API_BASE_URL=$API_BASE_URL
ARG MUI_X_LICENSE_KEY
ENV MUI_X_LICENSE_KEY=$MUI_X_LICENSE_KEY
RUN yarn gql-gen -e && yarn razzle build --noninteractive

# Clear all downloaded libraries to reduce image size
RUN yarn cache clean --all
# Re-install prod dependencies
RUN yarn workspaces focus --all --production

FROM node AS run

COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/package.json /app/yarn.lock /app/.yarnrc.yml /app/.pnp.* ./
COPY --from=builder /app/build ./build

RUN corepack install

LABEL org.opencontainers.image.title="CORD UI"
LABEL org.opencontainers.image.vendor="Seed Company"
LABEL org.opencontainers.image.source=https://github.com/SeedCompany/cord-field
LABEL org.opencontainers.image.licenses="MIT"

ENV PORT=80
EXPOSE 80

CMD ["yarn", "node", "build/server.js"]

ARG GIT_HASH
ARG GIT_BRANCH
RUN echo RAZZLE_GIT_HASH=$GIT_HASH >> .env
RUN echo RAZZLE_GIT_BRANCH=$GIT_BRANCH >> .env
