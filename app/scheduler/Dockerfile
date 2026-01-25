FROM node:21-alpine

WORKDIR /usr/src/app

# Copy root manifests
COPY package.json yarn.lock ./
COPY ./app/backend/db.js ./app/backend/redis_mongodb.js ./app/backend/
# Copy workspace manifest
COPY app/scheduler/package.json app/scheduler/package.json

# Install all workspace deps (root + scheduler)
RUN yarn install --production

# Copy the actual scheduler code
COPY app/scheduler app/scheduler

# Set working directory to scheduler
WORKDIR /usr/src/app/app/scheduler

