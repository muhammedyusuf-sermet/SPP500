'use strict';

const typeorm = require('typeorm');
const bcrypt = require('bcrypt');
const Hapi = require('hapi');

const server = Hapi.server({
    port: 3000,
    host: '0.0.0.0'
});


const User = require("./model/User").User;

let connection;

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
        return 'Hello, world!';
    }
});

server.route({
    method: 'POST',
    path: '/register',
    handler: async function (request, h) {
        var data = request.payload;
        
        // check if email is valid
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(data.email).toLowerCase())) {
            return {
                "status": 400,
                "message": "email is not valid"
            }
        }

        // check if username exists
        var username_check = await connection
            .getRepository(User)
            .createQueryBuilder("user")
            .where("user.username = :username", { username: data.username })
            .getOne();

        if (username_check) {
            return {
                "status": 400,
                "message": "already have this username"
            }
        }

        // check if email exists
        var email_check = await connection
            .getRepository(User)
            .createQueryBuilder("user")
            .where("user.email = :email", { email: data.email })
            .getOne();

        if (email_check) {
            return {
                "status": 400,
                "message": "already have this email"
            }
        }

        // check if password fails
        if (data.password.length < 8) {
            return {
                "status": 400,
                "message": "password is not strong enough"
            }
        }

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(data.password, salt);

        var repository = connection.getRepository("User");
        const user = await repository.insert({
            name: data.name,
            username: data.username,
            password: hash,
            email: data.email,
            type: "user"
        });

        return {
            "status": 201,
            "message": "success"
        }
    }
});



const init = async () => {
    await typeorm.createConnection({
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
        connection = conn;
    }).catch(error => {
        console.log('DB connection error: ', error)
    });
    await server.start();
    module.exports["connection"] = connection
    console.log(`Server running at: ${server.info.uri}`);

};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

module.exports = {"init": init, "server": server};


init();