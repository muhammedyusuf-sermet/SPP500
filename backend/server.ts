/* EXAMPLE USE OF typeorm
import {createConnection} from "typeorm";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";

// connection settings are in the "ormconfig.json" file
createConnection().then(async connection => {

    const category1 = new Category();
    category1.name = "TypeScript";
    await connection.manager.save(category1);

    const category2 = new Category();
    category2.name = "Programming";
    await connection.manager.save(category2);

    const post = new Post();
    post.title = "Control flow based type analysis";
    post.text = `TypeScript 2.0 implements a control flow-based type analysis for local variables and parameters.`;
    post.categories = [category1, category2];

    await connection.manager.save(post);

    console.log("Post has been saved: ", post);

}).catch(error => console.log("Error: ", error));*/
'use strict';

import * as Hapi from "hapi";
import * as Typeorm from "typeorm";
import * as JWTHapi from "hapi-auth-jwt2";

import {User} from "./entity/User";
import {Registration} from "./registration";
import {Login} from "./login";

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
		method: 'GET',
		path: '/secret', 
		options: { auth: 'jwt' },
		handler: function (request) {
			return {
				"status": 201,
				"message": "This is a secret content."
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
