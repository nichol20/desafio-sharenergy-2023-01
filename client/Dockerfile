FROM node:16.15-alpine3.14

WORKDIR /home/node/app

COPY ./.docker/entrypoint.sh .

RUN chmod +x entrypoint.sh

USER node
