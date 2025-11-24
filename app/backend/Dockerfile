FROM node:21-alpine
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY ./app/backend/package.json ./app/backend/

RUN yarn install --production --cwd app/backend

COPY ./app/backend ./app/backend
WORKDIR /usr/src/app/app/backend


