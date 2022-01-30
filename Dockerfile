FROM node:16


COPY . /app

WORKDIR /app

RUN npm ci

RUN npm run build

EXPOSE 3000

CMD [ "npm" ,"run","start" ]