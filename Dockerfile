# latest node on alpine
FROM node:alpine3.14 AS builder

# change working directory
WORKDIR /app/

ARG BASE_URL
ARG VUE_APP_API_URL
ARG VUE_APP_API_WS
ARG VUE_APP_API_TIMEOUT

ENV BASE_URL=${BASE_URL}
ENV VUE_APP_API_URL=${VUE_APP_API_URL}
ENV VUE_APP_API_WS=${VUE_APP_API_WS}
ENV VUE_APP_API_TIMEOUT=${VUE_APP_API_TIMEOUT}

# copy package.json and download depedencies
# don't specify --production to install vue-cli-service from dev dependencies
COPY package.json package-lock.json ./
RUN npm install

# copy source files
# compile into static HTML/CSS/JS
# will use the .env.production.local for variable definition if present
COPY . .
RUN npm run build

# caddy
FROM caddy:alpine

# copy compiled static files from first step
COPY --from=builder /app/dist/. /srv
