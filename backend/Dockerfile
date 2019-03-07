FROM node:10-slim
EXPOSE 3000
RUN apt-get update
RUN apt-get install -y netcat
RUN npm install --global yarn
COPY ormconfig.docker.json /backend/ormconfig.json
COPY package.json yarn.lock /backend/
WORKDIR /backend
RUN yarn install --production --force
COPY . ./
CMD ["npm", "start"]