import {User} from "./entity/User"
import {Campaign} from "./entity/Campaign"
import {Character} from "./entity/Character"

import {CharacterFactory} from "./character";

jest.mock("./entity/Campaign");
jest.mock("./entity/Character");
jest.mock("./entity/User");


describe('character tests', async () => {
	beforeAll( async () => {
		let user = new User();
		user.Name = "John Doe";
		user.Id = 1;
		await user.save();
	
		let campaign = new Campaign();
		campaign.Name = "Test1";
		campaign.Id = 1;
		campaign.Creator = user;
		await campaign.save();

		const campaign2 = new Campaign();
		campaign2.Name = "Test2";
		campaign2.Id = 2;
		campaign2.Creator = user;
		await campaign2.save();

		const user2 = new User();
		user2.Name = "Other John Doe";
		user2.Id = 2;
		await user2.save();

		let campaign3 = new Campaign();
		campaign3.Name = "Test3";
		campaign3.Id = 3;
		campaign3.Creator = user2;
		await campaign3.save();
	});

	describe('character creation tests', async () => {

		var character = new CharacterFactory();

		test('when proper data is given', async () => {
			const response = await character.Create({
				payload: {
					"Name": "Test",
					"Campaigns": [
						{ "Id": 1 }
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

		test('when no campaign is provided', async () => {
			const response = await character.Create({
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
			expect(response['status']).toBe(201);
			expect(response['messages'].length).toBe(1)
			expect(response['messages'][0]).toBe("success");
		});

		test('when name is not provided', async () => {
			const response = await character.Create({
				payload: {
					"Notes": "Test"
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
			expect(response['messages'][0]).toBe("\"Name\" is required");
		});


		test('when an empty string is provided as the name', async () => {
			const response = await character.Create({
				payload: {
					"Name": ""
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

		test('when credentials dont match the campaign', async () => {
			const response = await character.Create({
				payload: {
					"Name": "Test",
					"Campaigns": [
						{"Id": 3}
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
			expect(response['messages'][0]).toBe("\"Campaign Id\" 3 is invalid");
		});

		test('when invalid campaign is given', async () => {
			const response = await character.Create({
				payload: {
					"Name": "Test",
					"Campaigns": [
						{"Id": 4}
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
			expect(response['messages'][0]).toBe("\"Campaign Id\" 4 is invalid");
		});

		test('when credentials match the campaign', async () => {
			const response = await character.Create({
				payload: {
					"Name": "Test",
					"Campaigns": [
						{"Id": 3}
					]
				},
				auth: {
					credentials: {
						id: 2
					}
				}
			});

			expect.assertions(3);
			expect(response['status']).toBe(201);
			expect(response['messages'].length).toBe(1)
			expect(response['messages'][0]).toBe("success");
		});
	});
	describe('character edit tests', () => {
		let character = new CharacterFactory();

		it('should not be ready', async () => {
			const response = await character.Edit({
				payload: {
					"Id": 1,
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
			expect(response['messages'][0]).toBe("Not implemented");
		});
	});
	
	describe('character delete tests', async () => {
		beforeAll( async () => {
	 		const user = new User();
			user.Name = "John Doe";
			user.Id = 1;
			await user.save();

			const user2 = new User();
			user2.Name = "John Doe";
			user2.Id = 2;
			await user2.save();

	 		let char = new Character();
			char.Name = "John Doe";
			char.Id = 1;
			char.Creator = user;
			await char.save();
		});

	 	var character = new CharacterFactory();

	 	test('When another user requests an character to delete when they are not the owner', async () => {
			const response = await character.Delete({
				params: {
					characterId: 1
				},
				auth: {
					credentials: {
						id: 2
					}
				}
			});
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1)
			expect(response['messages'][0]).toBe("Requester is not the owner.");
		});

	 	test('When owner of an character requests delete', async () => {
			const response = await character.Delete({
				params: {
					characterId: 1
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

		test('When an invalid character is given', async () => {
			const response = await character.Delete({
				params: {
					characterId: 2
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

		test('When character id is not a number', async () => {
			const response = await character.Delete({
				params: {
					characterId: 'test'
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
			expect(response['messages'][0]).toBe("Parameter 'characterId' must be a number.");
		});
	});

	describe('character get one tests', () => {
		beforeAll( async () => {
			Character.clear();

			let user = new User();
			user.Name = "John Doe";
			user.Id = 1;
			await user.save();

			let char = new Character();
			char.Name = "John Doe";
			char.Id = 1;
			char.Creator = user;
			await char.save();

			let user2 = new User();
			user2.Name = "John II Doe";
			user2.Id = 2;
			await user2.save();

			let char2 = new Character();
			char2.Name = "John II Doe";
			char2.Id = 2;
			char2.Creator = user2;
			await char2.save();
		});

		let character = new CharacterFactory();

		test('when character Id is given properly', async () => {
			const response = await character.GetOne({
				params: {
					characterId: 1
				},
				auth: {
					credentials: {
						id: 1
					}
				}
			});
			
			expect(response['status']).toBe(201);
			expect(response['messages'].length).toBe(0);
		});

		test('when character Id is nan', async () => {
			const response = await character.GetOne({
				params: {
					characterId: "test"
				},
				auth: {
					credentials: {
						id: 1
					}
				}
			});
			
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Parameter 'characterId' must be a number.");
		});

		test('when there is no character with that character Id', async () => {
			const response = await character.GetOne({
				params: {
					characterId: 3
				},
				auth: {
					credentials: {
						id: 1
					}
				}
			});
			
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Character is not found.");
		});

		test('when requester is not the owner', async () => {
			const response = await character.GetOne({
				params: {
					characterId: 2
				},
				auth: {
					credentials: {
						id: 1
					}
				}
			});
			
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Requester is not the owner.");
		});
	});
});


describe('character get all tests', async () => {
	beforeAll( async () => {
		Character.clear();

		let user = new User();
		user.Name = "John Doe";
		user.Id = 1;
		await user.save();

		let char = new Character();
		char.Name = "John Doe";
		char.Id = 1;
		char.Creator = user;
		await char.save();

		let char2 = new Character();
		char2.Name = "John II Doe";
		char2.Id = 2;
		char2.Creator = user;
		await char2.save();

		let char3 = new Character();
		char3.Name = "John III Doe";
		char3.Id = 3;
		char3.Creator = user;
		await char3.save();

	});

 	var character = new CharacterFactory();


 	test('when page number and page size is given properly for first page', async () => {
		const response = await character.GetMany({
			params: {
				page: 0,
				size: 2
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});


 		expect.assertions(6);
		expect(response['status']).toBe(201);
		expect(response['total']).toBe(3);
		expect(response['messages'].length).toBe(0);
		expect(response['content'].length).toBe(2);
		expect(response['content'][0].Id).toBe(1);
		expect(response['content'][1].Id).toBe(2);
	});

 	test('when page number and page size is given properly for last page', async () => {
		const response = await character.GetMany({
			params: {
				page: 1,
				size: 2
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});

 		expect.assertions(5);
		expect(response['status']).toBe(201);
		expect(response['total']).toBe(3);
		expect(response['messages'].length).toBe(0);
		expect(response['content'].length).toBe(1);
		expect(response['content'][0].Id).toBe(3);
	});

 	test('when page parameter is not number', async () => {
		const response = await character.GetMany({
			params: {
				page: "test",
				size: 2
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});

 		expect.assertions(4);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("Parameter 'page' must be a number.");
		expect(response.content).toEqual([])
	});

 	test('when size parameter is not number', async () => {
		const response = await character.GetMany({
			params: {
				page: 0,
				size: "test"
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});

 		expect.assertions(4);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("Parameter 'size' must be a number.");
		expect(response.content).toEqual([])
	});

	test('when page and size parameter is not number', async () => {
		const response = await character.GetMany({
			params: {
				page: "test",
				size: "test"
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});

 		expect.assertions(5);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(2);
		expect(response['messages'][0]).toBe("Parameter 'page' must be a number.");
		expect(response['messages'][1]).toBe("Parameter 'size' must be a number.");
		expect(response.content).toEqual([])
	});

});

// character edit pseudo tests

// When name is provided to change
// return success

// When provided name is empty
// raise error

// When provided notes is empty
// raise error

// When a new set of valid campaigns is provided to change
// return success

// When some campaigns are invalid within a given set of campaigns
// raise error

// When some campaigns are someone else's
// raise error

// When requester is not the creator of the character
// raise error

// When no character with given id
// raise error

