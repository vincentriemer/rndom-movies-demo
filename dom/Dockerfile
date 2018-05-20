FROM mhart/alpine-node:latest

RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN yarn
COPY dist /app/dist

EXPOSE 5000
CMD [ "npm", "start" ]