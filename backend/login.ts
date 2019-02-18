import {User} from "./entity/User";

import * as Bcrypt from "bcrypt";
import * as JWT from "jsonwebtoken";

/*
Parameters:
 - username or email
 - password
Sample curl request,
 curl --header "Content-Type: application/json" \
 --request POST \
 --data '{"username":"johndoe", "password":"testtest"}' \
 http://localhost:3000/login
 */
export class Login {
	public async Login(request) {
		var data = request.payload;

		if((data.username || data.email ) && data.password){
			var username = data.username;
			var email = data.email;
			var password = data.password;

			if (email) {
				var user = await User.findOne({ Email: email });
			} else if (username) {
				var user = await User.findOne({ Username: username });
			}
			
			if (!user) {
				return {
					"status": 400,
					"message": "Given credentials do not match with our records."
				}
			}
			
			var pass_check = Bcrypt.compareSync(password, user.HashedPassword);

			if (pass_check) {
				var payload = {id: user.Id};
				var token = JWT.sign(payload, process.env.JWTSECRET);

				return {
					"status": 201,
					"message": "Logged in successfully.",
					"token": token
				}

			} else {
				return {
					"status": 400,
					"message": "Given credentials do not match with our records."
				}
			}
		} else {
			return {
				"status": 400,
				"message": "Bad request"
			}
		}

		
	}
}