module.exports = {
    User:  class User {
	    constructor(id, name, username, email, password, type) {
	        this.id = id;
	        this.name = name;
	        this.username = username;
	        this.email = email;
	        this.password = password;
	        this.type = type;
	    }
	}
};