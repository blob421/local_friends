#! /bin/sh
echo "Running migrations..."

npx sequelize-cli db:migrate # Will add migrations to "SequelizeMeta" table for reference
node ./utility/add_animals.js
echo "Starting backend..."

exec node app.js
