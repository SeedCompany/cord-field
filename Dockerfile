# base ================================
FROM node:12-alpine as node

WORKDIR /app

ENV NODE_ENV=production

# builder =============================
FROM node as builder

# Install dependencies (in separate docker layer from app code)
COPY .yarn .yarn
COPY package.json yarn.lock .yarnrc.yml ./
COPY patches ./patches
RUN yarn install --immutable

COPY . .

RUN yarn build

# run =================================
FROM node as run

COPY --from=builder /app/build .

EXPOSE 80
CMD ["yarn", "node", "server.js"]
