FROM node:21-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /usr/src/app

COPY ./ML/animals.json ./ML/animals.json
COPY package.json yarn.lock .sequelizerc ./

## app/app/backend
COPY ./app/backend ./app/backend 
RUN yarn install --production

WORKDIR /usr/src/app/app/backend
RUN chmod +x ./entrypoint.sh
WORKDIR /usr/src/app

