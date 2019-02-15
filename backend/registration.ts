import * as Bcrypt from "bcrypt";

import {User} from "./entity/User";

export async function Register(request, h) {
	var data = request.payload;

	// check if email is valid
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!re.test(String(data.email).toLowerCase())) {
		return {
			"status": 400,
			"message": "Email is not valid, email needs to match the x@y.z format."
		}
	}

	// check if username exists
	var username_check = await User.find({ username: data.username });


	if (username_check.length > 0) {
		return {
			"status": 400,
			"message": "This username is already in use."
		}
	}
	
	// check if email exists
	var email_check = await User.find({ email: data.email });

	if (email_check.length > 0) {
		return {
			"status": 400,
			"message": "This email is already in use."
		}
	}
	
	// check if password fails
	if (data.password.length < 8) {
		return {
			"status": 400,
			"message": "Password should be at least 8 characters."
		}
	}

	var salt = Bcrypt.genSaltSync(10);
	var hash = Bcrypt.hashSync(data.password, salt);

	const user = new User();
	user.name = data.name;
	user.username = data.username;
	user.hashed_password = hash;
	user.email = data.email;
	user.type = "user";
	await user.save();


	return {
		"status": 201,
		"message": "success"
	}
}


// const init_aux = async () => {
// 	await Database.Init();
// }

// init_aux();