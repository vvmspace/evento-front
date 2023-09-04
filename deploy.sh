#!/bin/bash

for dir in services/*-service; do
    if [ -d "$dir" ]; then
        echo "Deploying service in directory $dir..."
        (cd "$dir" && yarn deploy)
    fi
done
