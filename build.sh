#!/bin/bash
npm run build && \
    docker buildx build --push --platform linux/amd64,linux/arm64 --tag nickydev/zapstream-utils .
