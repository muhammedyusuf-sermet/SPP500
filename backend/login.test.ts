import {User} from "./entity/User";
import {Registration} from "./registration";
import {Login} from "./login";

jest.mock("./entity/User");


describe('login tests', async () => {
	beforeAll( async () => {
		var reg = new Registration();
		const response = await reg.Register({
			payload: {
				"username": "john-doe",
				"name": "John Doe",
				"email": "john@doe.com",
				"password": "testtest"
			},
		});
	});

	var log = new Login();

	test('when a pair of username and the correct password for a registered user posted to the route', async () => {
		const response = await log.Login({
			payload: {
				"username": "john-doe",
				"password": "testtest"
			},
		});

		var payload = response['payload']

		expect.assertions(3);
		expect(response['status']).toBe(201);
		expect(response['message']).toBe("Logged in successfully.");
		expect(response['token']).toBeDefined();
	});

	test('when a pair of email and the correct password for a registered user posted to the route', async () => {
		const response = await log.Login({
			payload: {
				"email": "john@doe.com",
				"password": "testtest"
			},
		});

		var payload = response['payload']

		expect.assertions(3);
		expect(response['status']).toBe(201);
		expect(response['message']).toBe("Logged in successfully.");
		expect(response['token']).toBeDefined();
	});

	test('when a pair of email and a wrong password for a registered user posted to the route', async () => {
		const response = await log.Login({
			payload: {
				"email": "john@doe.com",
				"password": "test"
			},
		});

		var payload = response['payload']

		expect.assertions(2);
		expect(response['status']).toBe(400);
		expect(response['message']).toBe("Given credentials do not match with our records.");
	});

	test('when a pair of username and a wrong password for a registered user posted to the route', async () => {
		const response = await log.Login({
			payload: {
				"email": "john@doe.com",
				"password": "test"
			},
		});

		var payload = response['payload']

		expect.assertions(2);
		expect(response['status']).toBe(400);
		expect(response['message']).toBe("Given credentials do not match with our records.");
	});

	test('when a pair of username and a wrong password for a registered user posted to the route', async () => {
		const response = await log.Login({
			payload: {
				"username": "john-doe",
				"password": "test"
			},
		});

		var payload = response['payload']

		expect.assertions(2);
		expect(response['status']).toBe(400);
		expect(response['message']).toBe("Given credentials do not match with our records.");
	});

	test('when a pair of email and a password that doesn not match with any registered user posted to the route', async () => {
		const response = await log.Login({
			payload: {
				"username": "john",
				"password": "test"
			},
		});

		var payload = response['payload']

		expect.assertions(2);
		expect(response['status']).toBe(400);
		expect(response['message']).toBe("Given credentials do not match with our records.");
	});

	test('when an unrelated request is made', async () => {
		const response = await log.Login({
			payload: {
				"user": "john",
				"password": "test"
			},
		});

		var payload = response['payload']

		expect.assertions(2);
		expect(response['status']).toBe(400);
		expect(response['message']).toBe("Bad request");
	});
});
