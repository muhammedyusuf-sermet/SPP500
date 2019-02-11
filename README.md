# DM-Tools
> A Dungeons and Dragons 5e tool dedicated to assist DM using [`electron-webpack`](https://github.com/electron-userland/electron-webpack).

## Getting Started
Simply clone down this repository, install dependencies, and get started.

```bash
# copy repository using git clone
git clone https://github.com/UIOWA5830SP19/SPP500.git
cd SPP500

# install dependencies
yarn
```

### Development Scripts
#### Frontend
```bash
# run application in development mode
yarn dev

# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```

#### Backend
> Note: This backend server works on Windows containers currently. If you are on a Mac, you will need to work with a Windows container as follows: https://stackoverflow.com/questions/45380972/how-can-i-run-a-docker-windows-container-on-osx
```bash
# Navigate into the backend folder
cd backend

# build and run docker image (Note: this both runs and builds the docker file sequentially. It will only build it once unless you specify the build again in the below commands. This only matters to developers. For users, they will only need to run it once, ideally)
docker-compose up

# (Optional/when changes are made to the local files)
# rebuilds docker image
docker-compose build
# runs the docker image
docker run backend_server

# install dependencies
npm install
# Alternatively 
yarn install

# run application
npm start 
# Alternatively 
yarn start

```
