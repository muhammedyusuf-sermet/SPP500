import {User} from "./entity/User";
import {Registration} from "./registration";

jest.mock("./entity/User");



describe('registration tests', () => {
	var reg = new Registration();

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
		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("success");
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

		// var payload = response['payload']
		
		expect.assertions(4);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(2);
		expect(response['messages'][0]).toBe("Email is not valid, email needs to match the x@y.z format.");
		expect(response['messages'][1]).toBe("This username is already in use.");
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
		
		expect.assertions(5);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(3);
		expect(response['messages'][0]).toBe("This username is already in use.");
		expect(response['messages'][1]).toBe("This email is already in use.");
		expect(response['messages'][2]).toBe("Password should be at least 8 characters.");
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
		
		expect.assertions(4);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(2);
		expect(response['messages'][0]).toBe("This username is already in use.");
		expect(response['messages'][1]).toBe("This email is already in use.");
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
		
		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("This email is already in use.");
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

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("This username is already in use.");
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

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("Password should be at least 8 characters.");

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

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("Email is not valid, email needs to match the x@y.z format.");

	});
});
