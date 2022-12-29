FROM node:18.12-alpine

RUN mkdir -p /usr/src/app
COPY ./ /usr/src/app/dronepollservice
WORKDIR /usr/src/app/dronepollservice
RUN npm i && npm run tsc

CMD ["npm", "start"]