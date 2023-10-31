# base ================================
FROM public.ecr.aws/docker/library/node:20-slim as node

LABEL org.opencontainers.image.title="CORD UI"
LABEL org.opencontainers.image.vendor="Seed Company"
LABEL org.opencontainers.image.source=https://github.com/SeedCompany/cord-field
LABEL org.opencontainers.image.licenses="MIT"

WORKDIR /app

ENV NODE_ENV=production \
    PORT=80
EXPOSE 80

ARG GIT_HASH
ARG GIT_BRANCH
RUN echo RAZZLE_GIT_HASH=$GIT_HASH >> .env
RUN echo RAZZLE_GIT_BRANCH=$GIT_BRANCH >> .env

# builder =============================
FROM node as builder

# Install dependencies (in separate docker layer from app code)
COPY .yarn .yarn
COPY package.json yarn.lock .yarnrc.yml ./
ENV VERBOSE_YARN_LOG=discard
RUN yarn install --immutable

COPY . .

ARG API_BASE_URL
ENV RAZZLE_API_BASE_URL=$API_BASE_URL
RUN yarn gql-gen -e && yarn razzle build --noninteractive

# Remove dev dependencies
RUN yarn workspaces focus --all --production

# run =================================
FROM node as run

COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/package.json /app/yarn.lock /app/.yarnrc.yml /app/.pnp.* ./
COPY --from=builder /app/build ./build

CMD ["yarn", "node", "build/server.js"]
