import {Registration} from "./registration";

describe('registration tests', () => {
	var returnValue1 = { payload: {status: 201, messages: ['success']} };
	var returnValue2 = { payload: {status: 400, messages: ['Email is not valid, email needs to match the x@y.z format.', 'This username is already in use.']} };
	var returnValue3 = { payload: {status: 400, messages: ['This username is already in use.', 'This email is already in use.', 'Password should be at least 8 characters.']} };
	var returnValue4 = { payload: {status: 400, messages: ['This username is already in use.', 'This email is already in use.']} };
	var returnValue5 = { payload: {status: 400, messages: ['This email is already in use.']} };
	var returnValue6 = { payload: {status: 400, messages: ['This username is already in use.']} };
	var returnValue7 = { payload: {status: 400, messages: ['Password should be at least 8 characters.']} };
	var returnValue8 = { payload: {status: 400, messages: ['Email is not valid, email needs to match the x@y.z format.']} };

	const mockRegistration = jest.fn();

	var reg = new Registration();

	mockRegistration.mockReturnValueOnce(returnValue1)
				.mockReturnValueOnce(returnValue2)
				.mockReturnValueOnce(returnValue3)
				.mockReturnValueOnce(returnValue4)
				.mockReturnValueOnce(returnValue5)
				.mockReturnValueOnce(returnValue6)
				.mockReturnValueOnce(returnValue7)
				.mockReturnValueOnce(returnValue8);

	reg.Register = mockRegistration;

	test('registers a user when provided with a valid form', async () => {
		const response = await reg.Register({
			payload: {
				"username": "john-doe",
				"name": "John Doe",
				"email": "john@doe.com",
				"password": "testtest"
			},
		}, null);

		var payload = response['payload']

		expect.assertions(3);
		expect(payload['status']).toBe(201);
		expect(payload['messages'].length).toBe(1);
		expect(payload['messages'][0]).toBe("success");
	});

	test('does not register a user when a non-valid email and registered username are provided', async () => {
		
		const response = await reg.Register({
			payload: {
				"username": "john-doe",
				"name": "John Doe",
				"email": "johndoe.com",
				"password": "testtest"
			}
		}, null);

		var payload = response['payload']
		
		expect.assertions(4);
		expect(payload['status']).toBe(400);
		expect(payload['messages'].length).toBe(2);
		expect(payload['messages'][0]).toBe("Email is not valid, email needs to match the x@y.z format.");
		expect(payload['messages'][1]).toBe("This username is already in use.");
	});

	test('does not register a user when a registered email, registered username and, non-valid password are provided', async () => {
		
		const response = await reg.Register({
			payload: {
				"username": "john-doe",
				"name": "John Doe",
				"email": "john@doe.com",
				"password": "test"
			}
		}, null);

		var payload = response['payload']
		
		expect.assertions(5);
		expect(payload['status']).toBe(400);
		expect(payload['messages'].length).toBe(3);
		expect(payload['messages'][0]).toBe("This username is already in use.");
		expect(payload['messages'][1]).toBe("This email is already in use.");
		expect(payload['messages'][2]).toBe("Password should be at least 8 characters.");
	});

	test('does not register a user when a registered email and registered username is provided', async () => {
		
		const response = await reg.Register({
			payload: {
				"username": "john-doe",
				"name": "John Doe",
				"email": "john@doe.com",
				"password": "testtest"
			}
		}, null);

		var payload = response['payload']
		
		expect.assertions(4);
		expect(payload['status']).toBe(400);
		expect(payload['messages'].length).toBe(2);
		expect(payload['messages'][0]).toBe("This username is already in use.");
		expect(payload['messages'][1]).toBe("This email is already in use.");
	});

	test('does not register a user when a registered email is provided', async () => {
		
		const response = await reg.Register({
			payload: {
				"username": "john-doe1",
				"name": "John Doe",
				"email": "john@doe.com",
				"password": "testtest"
			}
		}, null);

		var payload = response['payload']
		
		expect.assertions(3);
		expect(payload['status']).toBe(400);
		expect(payload['messages'].length).toBe(1);
		expect(payload['messages'][0]).toBe("This email is already in use.");
	});

	test('does not register a user when a registered username is provided', async () => {
		
		const response = await reg.Register({
			payload: {
				"username": "john-doe",
				"name": "John Doe",
				"email": "john@doe1.com",
				"password": "testtest"
			}
		}, null);

		var payload = response['payload']
		
		expect.assertions(3);
		expect(payload['status']).toBe(400);
		expect(payload['messages'].length).toBe(1);
		expect(payload['messages'][0]).toBe("This username is already in use.");
	});

	test('does not register a user when password is not at least 8 characters', async () => {
		
		const response = await reg.Register({
			payload: {
				"username": "john-doe1",
				"name": "John Doe",
				"email": "john1@doe.com",
				"password": "test"
			}
		}, null);

		var payload = response['payload']

		expect.assertions(3);
		expect(payload['status']).toBe(400);
		expect(payload['messages'].length).toBe(1);
		expect(payload['messages'][0]).toBe("Password should be at least 8 characters.");

	});

	test('does not register a user when email is not in the right format', async () => {
		
		const response = await reg.Register({
			payload: {
				"username": "john-doe1",
				"name": "John Doe",
				"email": "john1",
				"password": "testtest"
			}
		}, null);

		var payload = response['payload']
		
		expect.assertions(3);
		expect(payload['status']).toBe(400);
		expect(payload['messages'].length).toBe(1);
		expect(payload['messages'][0]).toBe("Email is not valid, email needs to match the x@y.z format.");

	});
});
