#!/bin/sh

until nc -z "rabbitmq" "5672"; do
echo "Waiting for rabbitmq ..."
sleep 1
done

exec node worker.js