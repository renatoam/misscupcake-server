# Good practice: always specify the version and always use official image version
FROM node:16.15-alpine

# Had to use this cause some conflict with pnpm
RUN apk add --no-cache g++ make py3-pip

RUN mkdir app

WORKDIR /app

COPY package*.json /app/

RUN npm install

# Good practice: put copy files after install to leverage layer cache when changing app later
COPY . /app

RUN npm run build

EXPOSE 3001

CMD [ "npm", "start" ]
