'use strict';

import * as Hapi from "hapi";
import * as Register from "./registration";

export const Server = new Hapi.Server({
	port: 3000,
	host: '0.0.0.0'
});

Server.route({
	method: 'GET',
	path: '/',
	handler: function (request, h) {
		return 'Hello, world!';
	}
});

Server.route({
	method: 'POST',
	path: '/register',
	handler: Register.Register
});


export const init = async () => {
	await Server.start();
	console.log(`Server running at: ${Server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
	console.log(err);
	process.exit(1);
});

init();