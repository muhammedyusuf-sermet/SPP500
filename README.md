# DM-Tools
> A Dungeons and Dragons 5e tool dedicated to assist DM using [`electron-webpack`](https://github.com/electron-userland/electron-webpack).

[![Build Status](https://travis-ci.org/UIOWA5830SP19/SPP500.svg?branch=master)](https://travis-ci.org/UIOWA5830SP19/SPP500)[![codecov](https://codecov.io/gh/UIOWA5830SP19/SPP500/branch/master/graph/badge.svg)](https://codecov.io/gh/UIOWA5830SP19/SPP500)

## Getting Started
Simply clone down this repository, install dependencies, and get started.

```bash
# copy repository using git clone
git clone https://github.com/UIOWA5830SP19/SPP500.git
cd SPP500

# install dependencies
yarn install

```

### Development Scripts
#### Frontend

```bash
# From the applications main directory (SPP500/)

# Option 1: 
# run application in development mode
yarn frontend-dev

```

To export the application for deployment/user distribution

```bash

# Option 1: (Native OS only unless additional packages installed)
# essentially `yarn compile` & create build with electron-builder for your native OS
yarn frontend-dist

# Option 2: (Native OS only unless additional packages installed)
# essentially `yarn compile` & create unpacked build with electron-builder for your native OS
yarn frontend-dist:dir

# Option 3: (Any OS)

# Use Electron Packager https://github.com/electron-userland/electron-packager

# Install Electron Packager for your CLI 
npm install electron-packager -g

# Export for all OS that you have dependencies/permissions for
electron-packager frontend DMTools --all

# A few examples for single OS exports

# Export for just a Mac OS (dmg)
electron-packager frontend DMTools --platform=darwin

# Export for just a Windows 64 bit (exe)
electron-packager frontend DMTools --platform=win32 --arch=x64


```

To then run this application, either click or run the dmg/exe/appropriate output as you would with any other normal program.

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
