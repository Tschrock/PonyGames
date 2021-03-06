FROM node:lts-alpine
WORKDIR /app
COPY package.json /app
RUN npm install --production
COPY . /app
CMD node dist/server/server.js
EXPOSE 8080
