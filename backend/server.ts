'use strict';

import * as Hapi from "hapi";
import * as Typeorm from "typeorm";

import {User} from "./entity/User";
import {Registration} from "./registration";

export const Server = new Hapi.Server({
	port: 3000,
	host: '0.0.0.0'
});

// Server.route({
// 	method: 'GET',
// 	path: '/',
// 	handler: function (request, h) {
// 		return 'Hello, world!';
// 	}
// });

Server.route({
	method: 'POST',
	path: '/register',
	handler: function (request, h) {
        var reg = new Registration();
        return reg.Register(request, h);
    }
});


export const init = async () => {
	await Server.start();
    await Typeorm.createConnection({
        "type": "postgres",
        "host": process.env.HOST,
        "port": Number(process.env.PORT),
        "username": process.env.USERNAME,
        "password": process.env.PASSWORD,
        "database": process.env.DATABASE,
        "synchronize": true,
        "entities": [
            User
        ]
    }).then(async function (conn) {
        console.log("connected")
    }).catch(error => {
        console.log('DB connection error: ', error)
    });
	console.log(`Server running at: ${Server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
	console.log(err);
	process.exit(1);
});

init();