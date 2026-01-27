#! /bin/sh

until pg_isready -h "$POSTGRES_HOST" -p 5432 -U "$POSTGRES_USER"; 
do sleep 1 
echo "waiting for postgres"
done
echo "Migrating Regions & badges ..."


echo "Running migrations..."

npx sequelize-cli db:migrate # Will add migrations to "SequelizeMeta" table for reference

## COPYING csv tables
export PGPASSWORD="$POSTGRES_PASSWORD"
Regions=$(psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT COUNT(*) FROM \"Regions\";" | tr -d '[:space:]')
Addresses=$(psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT COUNT(*) FROM \"Addresses\";" | tr -d '[:space:]')
Badges=$(psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -c "SELECT COUNT(*) FROM \"Badges\";" | tr -d '[:space:]')


if [ "$Regions" -gt 1 ]; then 
echo "Regions table already has data"
else
echo "Copying regions from csv..."
psql \
     -h postgres \
     -U postgres \
     -d js-backend \
     -c "\copy \"Regions\" FROM '/usr/src/app/app/backend/db/pg_csv/Regions.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');"\
     && rm '/usr/src/app/app/backend/db/pg_csv/Regions.csv'
fi

if [ "$Addresses" -gt 1 ]; then 
echo "Addresses table already has data"
else
echo "Copying Addresses from csv..."
psql \
     -h postgres \
     -U postgres \
     -d js-backend \
     -c "\copy \"Addresses\" FROM '/usr/src/app/app/backend/db/pg_csv/Addresses.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');"\
     && rm '/usr/src/app/app/backend/db/pg_csv/Addresses.csv'
fi

if [ "$Badges" -gt 1 ]; then 
echo "Badges table already has data"
else
echo "Copying Badges from csv..."
psql \
     -h postgres \
     -U postgres \
     -d js-backend \
     -c "\copy \"Badges\" FROM '/usr/src/app/app/backend/db/pg_csv/Badges.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');" \
     && rm '/usr/src/app/app/backend/db/pg_csv/Badges.csv'
fi



cd app/backend

echo "... Adding animals"
node ./utility/add_animals.js

echo "Starting backend..."
exec node app.js
