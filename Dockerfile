# base ================================
FROM node:12-alpine as node

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

RUN apk add --no-cache jq

# Install dependencies (in separate docker layer from app code)
COPY .yarn .yarn
COPY package.json yarn.lock .yarnrc.yml ./
COPY patches ./patches
RUN yarn install --immutable

COPY . .

ARG API_BASE_URL
ENV RAZZLE_API_BASE_URL=$API_BASE_URL
RUN yarn gql-gen -e && yarn razzle build --noninteractive

# list and remove dev dependencies
# yarn v2 doesn't have an install only production deps command
RUN jq -r '.devDependencies | keys | .[]' package.json | xargs yarn remove

# run =================================
FROM node as run

COPY --from=builder /app ./

CMD ["node", "build/server.js"]
