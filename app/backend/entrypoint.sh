#! /bin/sh
echo "Running migrations..."

npx sequelize-cli db:migrate # Will add migrations to "SequelizeMeta" table for reference

echo "Starting backend..."

exec node app.js
