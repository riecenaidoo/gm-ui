# Secondary Dockerfile for use locally during development.
# If you already have the tooling (node, npm, ng) use this after `make build`.

# [Source](https://hub.docker.com/_/nginx)
FROM nginx:stable-alpine

# Build image with the desired configuration, rather than mounting it.
COPY nginx.conf /etc/nginx/nginx.conf
# See 'angular.json' > "architect > build > options > outputPath". Confirm the folder targeted contains the 'index.html'.
COPY /dist/gm-ui/browser /usr/share/nginx/html

# Ensure Nginx runs in the foreground so the container doesn't shut down immediately.
# Daemon process is for running it on a host machine in the background; containerisation has slightly different needs.
CMD ["nginx", "-g", "daemon off;"]
