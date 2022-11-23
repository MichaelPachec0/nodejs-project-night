FROM node:alpine
RUN apk update --no-cache
ENV APP_HOME /home/node
WORKDIR $APP_HOME
USER node
ENV PATH /app/node_modules/.bin:$PATH
COPY --chown=1000:1000 . $APP_HOME
RUN npm -i
CMD ["npm","run","start"]
