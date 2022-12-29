FROM node:18.12-alpine AS builder

COPY ./dronemonitorfront ./frontend

WORKDIR /frontend
RUN npm i && npm run build


FROM node:18.12-alpine

RUN mkdir -p /usr/src/app
COPY ./backend /usr/src/app/backend
WORKDIR /usr/src/app/backend
RUN npm i && npm run tsc

COPY --from=builder /frontend/build/ /usr/src/app/backend/frontend

CMD ["npm", "start"]