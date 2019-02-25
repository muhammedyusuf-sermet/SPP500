FROM node:10-slim
COPY . /backend
WORKDIR /backend
EXPOSE 3000
RUN apt-get update
RUN apt-get install -y netcat
RUN npm install --global yarn
RUN yarn install --production --force
COPY ormconfig.docker.json ./ormconfig.json
CMD ["npm", "start"]