# 1) Build
FROM node:22-alpine AS builder

# Set the working directory to avoid installing in system root
WORKDIR /app
# Install Angular CLI globally to use from command line for 'ng build'
# [npm docs](https://docs.npmjs.com/cli/v10/configuring-npm/folders)
RUN npm install -g @angular/cli@18
# Copy package files that contain what we need to install
COPY package*.json ./
# Install packages, which includes Angular but we want to install that globally to run 'ng' commands
RUN npm install
COPY . .
# Run build
RUN ng build

# 2) Run
# [Source](https://hub.docker.com/_/nginx)
FROM nginx:stable-alpine

# Build image with the desired configuration, rather than mounting it.
COPY nginx.conf /etc/nginx/nginx.conf
# See 'angular.json' > "architect > build > options > outputPath". Confirm the folder targeted contains the 'index.html'.
COPY --from=builder /app/dist/gm-catalogue-builder/browser /usr/share/nginx/html

# Ensure Nginx runs in the foreground so the container doesn't shut down immediately.
# Daemon process is for running it on a host machine in the background; containerisation has slightly different needs.
CMD ["nginx", "-g", "daemon off;"]
