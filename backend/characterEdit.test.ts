import {User} from "./entity/User"
import {Character} from "./entity/Character"

import {CharacterFactory} from "./character";

jest.mock("./entity/Character");
jest.mock("./entity/User");

describe('character edit tests', async () => {
	beforeAll( async () => {
		Character.clear();

		let user = new User();
		user.Name = "John Doe";
		user.Id = 1;
		await user.save();

		const user2 = new User();
		user2.Name = "Other John Doe";
		user2.Id = 2;
		await user2.save();

		let char = new Character();
		char.Name = "John Doe";
		char.Id = 1;
		char.Creator = user;
		await char.save();

		let char2 = new Character();
		char2.Name = "John II Doe";
		char2.Id = 2;
		char2.Creator = user2;
		await char2.save();
	});

	var character = new CharacterFactory();

	test('When valid info is provided to change', async () => {
		const response = await character.Edit({
			payload: {
				"Id": 1,
				"Name": "new name",
				"Level": 5,
				"Class": "Cleric",
				"Race": "Gnome",
				"MaxHealth": 15,
				"ArmorClass": 5,
				"Notes": "same notes"
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

	test('When provided name is empty', async () => {
		const response = await character.Edit({
			payload: {
				"Id": 1,
				"Name": "",
				"Notes": "same notes"
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
		expect(response['messages'][0]).toBe("\"Name\" is not allowed to be empty");
	});

	test('When provided with an invalid Character Class is given', async () => {
		const response = await character.Edit({
			payload: {
				"Id": 1,
				"Name": "same name",
				"Class": "Autobot",
				"Notes": "same notes"
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
		expect(response['messages'][0]).toBe("\"Class\" Autobot is invalid");
	});

	test('When provided notes is empty', async () => {
		const response = await character.Edit({
			payload: {
				"Id": 1,
				"Name": "same name",
				"Notes": ""
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
		expect(response['messages'][0]).toBe("\"Notes\" is not allowed to be empty");
	});

	test('When requester is not the creator of the character', async () => {
		const response = await character.Edit({
			payload: {
				"Id": 2,
				"Name": "different name"
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
		expect(response['messages'][0]).toBe("Requester is not the owner.");
	});

	test('When no character with given id', async () => {
		const response = await character.Edit({
			payload: {
				"Id": 4,
				"Name": "same name"
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
		expect(response['messages'][0]).toBe("Character is not found.");
	});

});