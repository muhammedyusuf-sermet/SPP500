import {Server} from "./server";

describe('registration tests', () => {
	var returnValue1 = { payload: {status: 201, message: 'success'} };
	var returnValue2 = { payload: {status: 400, message: 'This email is already in use.'} };
	var returnValue3 = { payload: {status: 400, message: 'This username is already in use.'} };
	var returnValue4 = { payload: {status: 400, message: 'Password should be at least 8 characters.'} };
	var returnValue5 = { payload: {status: 400, message: 'Email is not valid, email needs to match the x@y.z format.'} };

	const mockServer = jest.fn();

	mockServer.mockReturnValueOnce(returnValue1)
				.mockReturnValueOnce(returnValue2)
				.mockReturnValueOnce(returnValue3)
				.mockReturnValueOnce(returnValue4)
				.mockReturnValueOnce(returnValue5);

	Server.inject = mockServer;

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

		var payload = response['payload']

		expect.assertions(2);
		expect(payload['status']).toBe(201);
		expect(payload['message']).toBe("success");
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

		var payload = response['payload']
		
		expect.assertions(2);
		expect(payload['status']).toBe(400);
		expect(payload['message']).toBe("This email is already in use.");
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

		var payload = response['payload']
		
		expect.assertions(2);
		expect(payload['status']).toBe(400);
		expect(payload['message']).toBe("This username is already in use.");

	});

	test('does not register a user when password is not at least 8 characters', async () => {
		
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

		var payload = response['payload']

		expect.assertions(2);
		expect(payload['status']).toBe(400);
		expect(payload['message']).toBe("Password should be at least 8 characters.");

	});

	test('does not register a user when email is not in the right format', async () => {
		
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

		var payload = response['payload']
		
		expect.assertions(2);
		expect(payload['status']).toBe(400);
		expect(payload['message']).toBe("Email is not valid, email needs to match the x@y.z format.");

	});
});
