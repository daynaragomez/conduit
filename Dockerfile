FROM cypress/base:14.18.1

RUN mkdir -p /app
WORKDIR  /app

COPY . /app

RUN npm install

RUN $(npm bin)/cypress verify

RUN [ "npm", "run", "cypress:e2e"]