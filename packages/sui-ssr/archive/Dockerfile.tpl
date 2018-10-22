FROM keymetrics/pm2:latest-alpine

WORKDIR /usr/src/app

COPY pm2.json .
COPY ./public ./public
COPY ./server ./server
COPY ./statics ./statics
COPY ./package.json ./package.json

# HERE BEGIN THE AUTH ENV VARIABLES
{{AUTH_VARIABLES}}
####################################

EXPOSE 3000

CMD [ "pm2-runtime", "start", "pm2.json"]
