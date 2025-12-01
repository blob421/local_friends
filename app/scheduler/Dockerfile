FROM node:21-alpine
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY ./app/scheduler/package.json ./scheduler/

RUN yarn install --production --cwd app/scheduler

COPY ./app/scheduler ./scheduler
WORKDIR /usr/src/app/scheduler


