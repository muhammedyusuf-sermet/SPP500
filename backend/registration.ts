import * as Bcrypt from "bcrypt";

import {User} from "./entity/User";

/*
Parameters:
 - username
 - email
 - password
 - name
Sample curl request,
 curl --header "Content-Type: application/json" \
 --request POST \
 --data '{"username":"johndoe", "email": "john@doe.com", "name": "john", "password":"test"}' \
 http://localhost:3000/register
 */
export class Registration {
    public async Register(request, h) {
    	var data = request.payload;
        var messages = [];

    	// check if email is valid
    	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	if (!re.test(String(data.email).toLowerCase())) {
    		messages.push("Email is not valid, email needs to match the x@y.z format.")
    	}

    	// check if username exists
    	var username_check = await User.find({ Username: data.username });

    	if (username_check.length > 0) {
            messages.push("This username is already in use.")
    	}
    	
    	// check if email exists
    	var email_check = await User.find({ Email: data.email });

    	if (email_check.length > 0) {
            messages.push("This email is already in use.")
    	}
    	
    	// check if password fails
    	if (data.password.length < 8) {
            messages.push("Password should be at least 8 characters.")
    	}

        if (messages.length > 0) {
            return {
                "status": 400,
                "messages": messages
            }
        } else {
        	var salt = Bcrypt.genSaltSync(10);
        	var hash = Bcrypt.hashSync(data.password, salt);

        	const user = new User();
        	user.Name = data.name;
        	user.Username = data.username;
        	user.HashedPassword = hash;
        	user.Email = data.email;
        	user.Type = "user";
        	await user.save();


        	return {
        		"status": 201,
        		"messages": ["success"]
        	}
        }
    }
}
