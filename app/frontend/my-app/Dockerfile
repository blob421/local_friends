FROM node:21-alpine
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY ./app/frontend/my-app/package.json ./app/frontend/my-app/

RUN yarn install --production --cwd app/frontend/my-app

WORKDIR /usr/src/app/app/frontend/my-app
COPY ./app/frontend/my-app .


