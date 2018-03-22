#!/bin/sh

echo Cord Field Up

# left here to make it easy to pause execution to inspect the
# container if it's failing on start.
# while true; do sleep 2; done

exec "$@"
