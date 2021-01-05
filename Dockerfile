# base ================================
FROM node:12-alpine as node

WORKDIR /app

ENV NODE_ENV=production \
    PORT=80
EXPOSE 80

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
RUN yarn build

# list and remove dev dependencies
# yarn v2 doesn't have an install only production deps command
RUN jq -r '.devDependencies | keys | .[]' package.json | xargs yarn remove

# run =================================
FROM node as run

COPY --from=builder /app ./

CMD ["node", "build/server.js"]
