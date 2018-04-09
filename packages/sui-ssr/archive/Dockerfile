FROM keymetrics/pm2:latest-alpine

WORKDIR /usr/src/app

COPY pm2.json .
COPY ./public ./public
COPY ./server ./server
COPY ./statics ./statics

EXPOSE 3000

CMD [ "pm2-runtime", "start", "pm2.json"]
