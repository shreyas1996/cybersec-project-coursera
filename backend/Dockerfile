# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:latest as build
MAINTAINER Shreyas
LABEL name="Encrypted_Messaging" 


# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

RUN mkdir /app
ADD . /app

RUN set -x \
 && cd /app \
 && npm install \
 && npm cache clear --force

VOLUME /app/logs

WORKDIR /app

# needs a mongoinstance - defaults to container linking with alias 'mongo'
ENV DEPLOY_METHOD=docker \
    NODE_ENV=production \
    API_PORT=3000 \
    LOG_DIR=/app/logs

EXPOSE 3000

CMD ["node", "index.js"]
