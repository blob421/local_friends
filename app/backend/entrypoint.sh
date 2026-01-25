#! /bin/sh

until pg_isready -h "$POSTGRES_HOST" -p 5432 -U "$POSTGRES_USER"; 
do sleep 1 
echo "waiting for postgres"
done
echo "Running migrations..."

npx sequelize-cli db:migrate # Will add migrations to "SequelizeMeta" table for reference
cd app/backend

echo "... Adding animals"
node ./utility/add_animals.js

echo "Starting backend..."
exec node app.js
