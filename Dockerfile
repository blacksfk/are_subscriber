# latest node on alpine
FROM node:alpine3.14 AS builder

# change working directory
WORKDIR /app/

# copy package.json and download depedencies
# don't specify --production to install vue-cli-service from dev dependencies
COPY package.json package-lock.json ./
RUN npm install

# copy source files
# compile into static HTML/CSS/JS
# will use the .env.production.local for variable definition if present
COPY . .
RUN npm run build

# nginx
FROM nginx:alpine

# copy compiled static files from first step
COPY --from=builder /app/dist/. /usr/share/nginx/html/
