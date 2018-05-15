#!/usr/bin/env bash
set -ex;

docker build -f Dockerfile.test.dokr -t cord-field:tests.${1:-local} .
