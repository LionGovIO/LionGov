# syntax=docker/dockerfile:1
FROM node:16-alpine3.14
RUN apk add --no-cache g++ make
WORKDIR /lionrun
COPY . .
RUN yarn install
CMD ["node", "auth_server.js"]
