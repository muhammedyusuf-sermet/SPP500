import * as Bcrypt from "bcrypt";

import {User} from "./entity/User";
import {Login} from "./login";

jest.mock("./entity/User");


describe('login tests', async () => {
	beforeAll( async () => {
		var salt = Bcrypt.genSaltSync(10);
		var hash = Bcrypt.hashSync("testtest", salt);

		const user = new User();
		user.Name = "John Doe";
		user.Username = "john-doe";
		user.HashedPassword = hash;
		user.Email = "john@doe.com";
		user.Type = "user";
		await user.save();
	});

	var log = new Login();

	test('when a pair of username and the correct password for a registered user posted to the route', async () => {
		const response = await log.Login({
			payload: {
				"username": "john-doe",
				"password": "testtest"
			},
		});

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

		expect.assertions(2);
		expect(response['status']).toBe(400);
		expect(response['message']).toBe("Bad request");
	});
});
