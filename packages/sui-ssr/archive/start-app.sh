#!/usr/bin/env sh

FILTER="MS_"

for var in $(printenv); do
    test "${var#*$FILTER}" != "$var" && unset "$var"
done

echo "System Env variables after filter:"
printenv

exec "$@"

