FROM keymetrics/pm2:14-alpine

WORKDIR /usr/src/app

COPY pm2.json .
COPY ./public ./public
COPY ./server ./server
COPY ./statics ./statics
COPY ./package.json ./package.json
COPY ./start-app.sh ./start-app.sh

RUN chmod +x ./start-app.sh

# HERE BEGIN THE AUTH ENV VARIABLES
{{AUTH_VARIABLES}}
####################################

EXPOSE 3000

ENTRYPOINT ["./start-app.sh"]

CMD [ "pm2-runtime", "start", "pm2.json"]
