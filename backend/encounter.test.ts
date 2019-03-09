import {EncounterFactory} from "./encounter";
import {Monster} from "./entity/Monster"
import {User} from "./entity/User"

jest.mock("./entity/Monster");
jest.mock("./entity/Encounter");
jest.mock("./entity/User");

describe('encounter creation tests', async () => {
	// var encounter = new EncounterFactory();
	beforeAll( async () => {
		const monster = new Monster();
		monster.Name = "John Doe";
		monster.Id = 1;
		await monster.save();

		const user = new User();
		user.Name = "John Doe";
		user.Id = 1;
		await user.save();
	});

	var encounter = new EncounterFactory();

	test('when proper data is given', async () => {
		const response = await encounter.Create({
			payload: {
				"Name": "Test",
				"Description": "Test",
				"Monsters": [
					{"Id": 1}
				]
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});

		expect.assertions(3);

		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1)
		expect(response['messages'][0]).toBe("success");
	});

	test('when no monster is provided', async () => {
		const response = await encounter.Create({
			payload: {
				"Name": "Test",
				"Description": "Test"
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});

		expect.assertions(3);

		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1)
		expect(response['messages'][0]).toBe("success");
	});

	test('when name is not provided', async () => {
		const response = await encounter.Create({
			payload: {
				"Description": "Test"
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});

		expect.assertions(3);

		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1)
		expect(response['messages'][0]).toBe("Name must be provided.");
	});

	test('when an empty string is provided as the name', async () => {
		const response = await encounter.Create({
			payload: {
				"Name": "",
				"Description": "Test"
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});

		expect.assertions(3);

		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1)
		expect(response['messages'][0]).toBe("Name must be provided.");
	});

	test('when description is not provided', async () => {
		const response = await encounter.Create({
			payload: {
				"Name": "Test"
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});

		expect.assertions(3);

		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1)
		expect(response['messages'][0]).toBe("Description must be provided.");
	});

	test('when an empty string is provided as the description', async () => {
		const response = await encounter.Create({
			payload: {
				"Name": "Test",
				"Description": ""
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});

		expect.assertions(3);

		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1)
		expect(response['messages'][0]).toBe("Description must be provided.");
	});

	test('when invalid monster is given', async () => {
		const response = await encounter.Create({
			payload: {
				"Name": "Test",
				"Description": "Test",
				"Monsters": [
					{"Id": 2}
				]
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});

		expect.assertions(3);

		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1)
		expect(response['messages'][0]).toBe("Monster is invalid: 2");
	});
});

/*
Encounter editing tests

When name is provided to change
change the instance on db and return success

When description is provided to change
change the instance on db and return success

When a new set of valid monsters is provided to change
change the instance on db and return success

When some monsters are invalid within a given set of monsters
do not change the instance raise an error

*/