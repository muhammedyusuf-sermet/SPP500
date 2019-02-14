// START Registration Tests

const _server = require('./server.js');

let server;
let connection;

beforeAll(async () => {
	await _server.init();
	server = _server.server;
	connection = _server.connection;
});


afterAll(async () => {
	server.stop();
	connection.close();
});

describe('registration tests', () => {
	test('registers a user when provided with a valid form', async () => {
		
		const response = await server.inject({
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
		
		const response = await server.inject({
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
		
		const response = await server.inject({
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
		
		const response = await server.inject({
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
		
		const response = await server.inject({
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
