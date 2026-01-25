FROM node:21-alpine
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY ./app/frontend/ ./app/frontend

RUN yarn install --production

WORKDIR /usr/src/app/app/frontend/my-app



