FROM farwayer/react-native:min

WORKDIR /usr/src

COPY yarn.lock package.json ./
COPY local-forks/ ./local-forks/
RUN yarn

COPY . .
RUN yarn build:dom && mv dom/dist /public