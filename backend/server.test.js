// START Registration Tests

const Server_ = require('./server.js');

let Server;
let Connection;

beforeAll(async () => {
	await Server_.init();
	Server = Server_.server;
	Connection = Server_.connection;
});

afterAll(async () => {
	Server.stop();
	Connection.close();
});


describe('registration tests', () => {
	test('registers a user when provided with a valid form', async () => {
		
		const response = await Server.inject({
	        method: 'POST',
	        url: '/register',
	        payload: {
	        	"username": "john-doe",
	        	"name": "John Doe",
	        	"email": "john@doe.com",
	        	"password": "testtest"
	        }
	    });

	    var payload = JSON.parse(response.payload)

	    expect.assertions(2);
	    expect(payload.status).toBe(201);
	    expect(payload.message).toBe("success");
	});

	test('does not register a user when a registered email is provided', async () => {
		
		const response = await Server.inject({
	        method: 'POST',
	        url: '/register',
	        payload: {
	        	"username": "john-doe1",
	        	"name": "John Doe",
	        	"email": "john@doe.com",
	        	"password": "testtest"
	        }
	    });

		var payload = JSON.parse(response.payload)
		
	    expect.assertions(2);
	    expect(payload.status).toBe(400);
	    expect(payload.message).toBe("already have this email");
	});

	test('does not register a user when a registered username is provided', async () => {
		
		const response = await Server.inject({
	        method: 'POST',
	        url: '/register',
	        payload: {
	        	"username": "john-doe",
	        	"name": "John Doe",
	        	"email": "john1@doe.com",
	        	"password": "testtest"
	        }
	    });

		var payload = JSON.parse(response.payload)

	    expect.assertions(2);
	    expect(payload.status).toBe(400);
	    expect(payload.message).toBe("already have this username");
	});

	test('does not register a user when password is not valid', async () => {
		
		const response = await Server.inject({
	        method: 'POST',
	        url: '/register',
	        payload: {
	        	"username": "john-doe1",
	        	"name": "John Doe",
	        	"email": "john1@doe.com",
	        	"password": "test"
	        }
	    });

		var payload = JSON.parse(response.payload)

	    expect.assertions(2);
	    expect(payload.status).toBe(400);
	    expect(payload.message).toBe("password is not strong enough");
	});

	test('does not register a user when email is not valid', async () => {
		
		const response = await Server.inject({
	        method: 'POST',
	        url: '/register',
	        payload: {
	        	"username": "john-doe1",
	        	"name": "John Doe",
	        	"email": "john1",
	        	"password": "testtest"
	        }
	    });

		var payload = JSON.parse(response.payload)

	    expect.assertions(2);
	    expect(payload.status).toBe(400);
	    expect(payload.message).toBe("email is not valid");
	});

})

// END Registration Tests