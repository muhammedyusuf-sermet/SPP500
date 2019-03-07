FROM node:10-slim
EXPOSE 3000
RUN npm install --global yarn
COPY ormconfig.docker.json /backend/ormconfig.json
COPY package.json yarn.lock /backend/
WORKDIR /backend
RUN yarn install --production --force
COPY . ./
CMD ["npm", "start"]
