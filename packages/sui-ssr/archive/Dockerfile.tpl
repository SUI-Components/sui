FROM {{DOCKER_REGISTRY}}keymetrics/pm2:16-alpine

WORKDIR /usr/src/app

COPY pm2.json .
COPY ./public ./public
COPY ./server ./server
COPY ./statics ./statics
COPY ./package.json ./package.json

# HERE WE ADD THE ENTRY POINT PRE WORK
{{ENTRYPOINT_PREWORK}}
####################################


# HERE BEGIN THE AUTH ENV VARIABLES
{{AUTH_VARIABLES}}
####################################

EXPOSE 3000

# HERE WE ADD THE ENTRY POINT
{{ENTRYPOINT}}
####################################

CMD [ "pm2-runtime", "start", "pm2.json"]
