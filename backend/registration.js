const Bcrypt = require('bcrypt');
const Server_ = require('./server.js');
const Server = Server_.server;
const User = require("./model/User").User;

let Connection;

routes = [
    {
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
            var username_check = await Connection
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
            var email_check = await Connection
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

            var salt = Bcrypt.genSaltSync(10);
            var hash = Bcrypt.hashSync(data.password, salt);

            var repository = Connection.getRepository("User");
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
    },

]

const init_aux = async () => {
    await Server_.init();
    Connection = Server_.connection;
}

module.exports = routes;

init_aux();
