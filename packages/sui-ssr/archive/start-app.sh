#!/usr/bin/env sh

FILTER="MS_"

for var in $(printenv); do
    test "${var#*$FILTER}" != "$var" && unset "$var"
done

exec "$@"

