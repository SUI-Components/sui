#!/usr/bin/env sh

FILTER="^MS_|^FRONTEND_"

for var in $(printenv | grep -E "$FILTER"); do
    unset "$var"
done

echo "System Env variables after filter:"
printenv

exec "$@"

