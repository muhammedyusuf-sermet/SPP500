FROM node:10-slim
EXPOSE 3000
RUN npm install --global yarn
COPY package.json yarn.lock /backend/
WORKDIR /backend
RUN yarn install --production --force
COPY . ./
COPY ormconfig.docker.json ./ormconfig.json
CMD ["npm", "start"]
