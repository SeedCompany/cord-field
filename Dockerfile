# builder =============================
FROM node:12-alpine as builder

WORKDIR /app

ENV NODE_ENV=production

# Install dependencies (in separate docker layer from app code)
COPY .yarn .yarn
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

COPY . .

ARG API_BASE_URL
ENV REACT_APP_API_BASE_URL=$API_BASE_URL
RUN yarn build

# run =================================
FROM nginx

RUN printf '\n\
server {\n\
  listen 80;\n\
  listen [::]:80 default ipv6only=on;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  server_name _;\n\
  location / {\n\
    try_files $uri /index.html;\n\
  }\n\
}\n\
' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
