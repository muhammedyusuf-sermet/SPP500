import {EncounterFactory} from "./encounter";
import {Monster} from "./entity/Monster"
import {Encounter} from "./entity/Encounter"
import {User} from "./entity/User"

jest.mock("./entity/Monster");
jest.mock("./entity/Encounter");
jest.mock("./entity/User");

describe('encounter creation tests', async () => {
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

describe('encounter edit tests', async () => {
	// var encounter = new EncounterFactory();
	beforeAll( async () => {
		const monster = new Monster();
		monster.Name = "John Doe";
		monster.Id = 1;
		await monster.save();

		const monster2 = new Monster();
		monster2.Name = "Jane Doe";
		monster2.Id = 2;
		await monster2.save();

		const user = new User();
		user.Name = "John Doe";
		user.Id = 1;
		await user.save();

		const encounter = new Encounter();
		encounter.Id = 1;
		encounter.Name = "Test Name";
		encounter.Description = "Test Description";
		encounter.Creator = user;
		encounter.Monsters = [monster];
		await encounter.save();
	});

	var encounterFactory = new EncounterFactory();

	test('When name is provided to change', async () => {
		const response = await encounterFactory.Edit({
			payload: {
				"Id": 1,
				"Name": "new name"
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
		const response = await encounterFactory.Edit({
			payload: {
				"Id": 1,
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
		expect(response['messages'][0]).toBe("Name should not be an empty string.");
	});

	test('When description is provided to change', async () => {
		const response = await encounterFactory.Edit({
			payload: {
				"Id": 1,
				"Description": "new description"
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

	test('When provided description is empty', async () => {
		const response = await encounterFactory.Edit({
			payload: {
				"Id": 1,
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
		expect(response['messages'][0]).toBe("Description should not be an empty string.");
	});

	test('When a new set of valid monsters is provided to change', async () => {
		const response = await encounterFactory.Edit({
			payload: {
				"Id": 1,
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

		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1)
		expect(response['messages'][0]).toBe("success");
	});

	test('When some monsters are invalid within a given set of monsters', async () => {
		const response = await encounterFactory.Edit({
			payload: {
				"Id": 1,
				"Monsters": [
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
		expect(response['messages'][0]).toBe("Monster is invalid: 3");
	});

	test('When requester is not the creator of the encounter', async () => {
		const response = await encounterFactory.Edit({
			payload: {
				"Id": 1,
				"Name": "New name"
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
		expect(response['messages'][0]).toBe("Requester is not the creator of this encounter.");
	});

	test('When no encounter with given id', async () => {
		const response = await encounterFactory.Edit({
			payload: {
				"Id": 2,
				"Name": "New name"
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
		expect(response['messages'][0]).toBe("There is no such encounter saved.");
	});

});

describe('encounter delete tests', async () => {
	beforeAll( async () => {
 		const user = new User();
		user.Name = "John Doe";
		user.Id = 1;
		await user.save();

		const user2 = new User();
		user2.Name = "John Doe";
		user2.Id = 2;
		await user2.save();

 		const encounter = new Encounter();
		encounter.Id = 1;
		encounter.Name = "Test Name";
		encounter.Description = "Test Description";
		encounter.Creator = user;
		await encounter.save();
	});

 	var encounterFactory = new EncounterFactory();

 	test('When another user requests an encounter to delete when they are not the owner', async () => {
		const response = await encounterFactory.Delete({
			payload: {
				"Id": 1
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
		expect(response['messages'][0]).toBe("Requester is not the creator of this encounter.");
	});

 	test('When owner of an encounter requests delete', async () => {
		const response = await encounterFactory.Delete({
			payload: {
				"Id": 1
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

	test('When an invalid encounter is given', async () => {
		const response = await encounterFactory.Delete({
			payload: {
				"Id": 2
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
		expect(response['messages'][0]).toBe("There is no such encounter saved.");
	});
});

describe('encounter get all tests', async () => {
	beforeAll( async () => {
		Encounter.clear();

		const user = new User();
		user.Name = "John Doe";
		user.Id = 1;
		await user.save();

		const encounter = new Encounter();
		encounter.Id = 1;
		encounter.Name = "Test Name";
		encounter.Description = "Test Description";
		encounter.Creator = user;
		await encounter.save();

 		const encounter2 = new Encounter();
		encounter2.Id = 2;
		encounter2.Name = "Test Name 2";
		encounter2.Description = "Test Description 2";
		encounter2.Creator = user;
		await encounter2.save();

 		const encounter3 = new Encounter();
		encounter3.Id = 3;
		encounter3.Name = "Test Name 3";
		encounter3.Description = "Test Description 3";
		encounter3.Creator = user;
		await encounter3.save();
	});

 	var encounter = new EncounterFactory();


 	test('when page number and page size is given properly for first page', async () => {
		const response = await encounter.GetAll({
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
		const response = await encounter.GetAll({
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
		const response = await encounter.GetAll({
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

 		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("Parameter 'page' must be a number.");
	});

 	test('when size parameter is not number', async () => {
		const response = await encounter.GetAll({
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

 		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("Parameter 'size' must be a number.");
	});

 });

