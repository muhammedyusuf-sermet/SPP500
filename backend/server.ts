'use strict';

import * as Hapi from "hapi";
import * as Typeorm from "typeorm";
import * as JWTHapi from "hapi-auth-jwt2";

import {User} from "./entity/User";
import {Registration} from "./registration";
import {Login} from "./login";
import {MonsterFactory} from "./monster";
import {EncounterFactory} from "./encounter";

export const Server = new Hapi.Server({
	port: 3000,
	host: '0.0.0.0'
});

export const initServer = async () => {
	await Server.register(JWTHapi);

	Server.auth.strategy('jwt', 'jwt',
		{
			key: process.env.JWTSECRET,
			validate: validate,
			verifyOptions: { algorithms: [ 'HS256' ] }
		}
	);

	Server.auth.default('jwt');

	Server.route([{
		method: 'POST',
		path: '/register',
		options: { auth: false },
		handler: function (request) {
			var reg = new Registration();
			return reg.Register(request);
		}
	},
	{
		method: 'POST',
		path: '/login',
		options: { auth: false },
		handler: function (request) {
			var log = new Login();
			return log.Login(request);
		}
	},
	{
		method: 'POST',
		path: '/monster/create', 
		options: { auth: 'jwt' },
		handler: function (request) {
			var monster = new MonsterFactory();
			return monster.Create(request);
		}
	},
	{
		method: 'POST',
		path: '/encounter/create', 
		options: { auth: 'jwt' },
		handler: function (request) {
			var encounter = new EncounterFactory();
			return encounter.Create(request);
		}
	},
	{
		method: 'GET',
		path: '/verify', 
		options: { auth: 'jwt' },
		handler: function (request) {
			return {
				"status": 200,
				"message": "That is a valid token."
			};
		}
	},
	{
		method: 'GET',
		path: '/test',
		options: { auth: false },
		handler: function (request) {
			console.log("test request with docker update!")
			return {
				"status": 200,
				"message": "This is test content."
			};
		}
	}]);
}


const validate = async function (decoded: any, request: any) {
	var user = await User.findOne({ Id: decoded.id });

	if (user) {
		return { isValid: true };
	} else {
		return { isValid: false };
	}
};

export const init = async () => {
	await initServer();
	await Server.start();
	// This sets up active record ? maybe ?
	// This reads from ormconfig.ts
	if (Typeorm.createConnection()){
		console.log("Connected to DB.")
	} else {
		console.log('DB connection error.');
	}
	console.log(`Server running at: ${Server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
	console.log(err);
	process.exit(1);
});

init();
