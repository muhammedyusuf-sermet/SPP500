'use strict';

const Typeorm = require('typeorm');
const Hapi = require('hapi');

const Server = Hapi.server({
    port: 3000,
    host: '0.0.0.0'
});


const User = require("./model/User").User;

let Connection;

Server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
        return 'Hello, world!';
    }
});


const init = async () => {
    await Typeorm.createConnection({
        "type": "postgres",
        "host": "localhost",
        "port": "5432",
        "username": "postgres",
        "password": "test",
        "database": "sep",
        "synchronize": true,
        "entities": [
            require("./entity/UserSchema")
        ]
    }).then(async function (conn) {
        console.log("connected")
        Connection = conn;
    }).catch(error => {
        console.log('DB connection error: ', error)
    });
    await Server.start();
    module.exports["connection"] = Connection
    console.log(`Server running at: ${Server.info.uri}`);

};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

module.exports = {"init": init, "server": Server};

var registration = require('./registration');
Server.route(registration);

init();