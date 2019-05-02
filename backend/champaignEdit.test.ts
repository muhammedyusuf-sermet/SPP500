import { Encounter } from "./entity/Encounter"
import { User } from "./entity/User"
import { Campaign } from "./entity/Campaign"
import { Character } from "./entity/Character";

import { CampaignFactory } from "./campaign";

jest.mock("./entity/Campaign");
jest.mock("./entity/Encounter");
jest.mock("./entity/Character");
jest.mock("./entity/User");

describe('campaign edit tests', async () => {
	beforeAll( async () => {
		const user = new User();
		user.Name = "John Doe";
		user.Id = 1;
		await user.save();
	
		const encounter = new Encounter();
		encounter.Name = "John Doe's Encounter";
		encounter.Id = 1;
		encounter.Creator = user;
		await encounter.save();
		
		const encounter3 = new Encounter();
		encounter3.Name = "John Doe's 2nd Encounter";
		encounter3.Id = 3;
		encounter3.Creator = user;
		await encounter3.save();

		const character = new Character();
		character.Name = "John Doe's Character"
		character.Id = 1;
		character.Creator = user;
		await character.save();

		const character3 = new Character();
		character3.Name = "John Doe's Character"
		character3.Id = 3;
		character3.Creator = user;
		await character3.save();
	
		const campaign = new Campaign();
		campaign.Name = "Test1";
		campaign.Id = 1;
		campaign.Creator = user;
		campaign.Encounters = [encounter];
		campaign.Characters = [];
		await campaign.save();
	
		const campaign2 = new Campaign();
		campaign2.Name = "Test2";
		campaign2.Id = 2;
		campaign2.Creator = user;
		campaign2.Encounters = [];
		campaign2.Characters = [character];
		await campaign2.save();
	
		const user2 = new User();
		user2.Name = "Other John Doe";
		user2.Id = 2;
		await user2.save();
	
		const encounter2 = new Encounter();
		encounter2.Name = "Other John Doe's Encounter";
		encounter2.Id = 2;
		encounter2.Creator = user2;
		await encounter2.save();

		const character2 = new Character();
		character2.Name = "Other John Doe's Character"
		character2.Id = 2;
		character2.Creator = user;
		await character2.save();
	
		const campaign3 = new Campaign();
		campaign3.Name = "Test3";
		campaign3.Id = 3;
		campaign3.Creator = user2;
		campaign3.Encounters = [encounter2];
		campaign3.Characters = [character2];
		await campaign3.save();
	});

	var campaignFactory = new CampaignFactory();

	test('When name is provided to change', async () => {
		const response = await campaignFactory.Edit({
			payload: {
				"Id": 1,
				"Name": "new name",
				"Summary": "same summary",
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
		const response = await campaignFactory.Edit({
			payload: {
				"Id": 1,
				"Name": "",
				"Summary": "same summary"
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

	test('When provided summary is empty', async () => {
		const response = await campaignFactory.Edit({
			payload: {
				"Id": 1,
				"Name": "same name",
				"Summary": ""
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
		expect(response['messages'][0]).toBe("\success");
	});

	test('When a new set of valid encounters is provided to change', async () => {
		const response = await campaignFactory.Edit({
			payload: {
				"Id": 1,
				"Name": "same name",
				"Summary": "same summary",
				"Encounters": [
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
    	expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1)
		expect(response['messages'][0]).toBe("success");
	});

	test('When some encounters are invalid within a given set of encounters', async () => {
		const response = await campaignFactory.Edit({
			payload: {
				"Id": 1,
				"Name": "same name",
				"Summary": "same summary",
				"Encounters": [
					{"Id": 5}
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
		expect(response['messages'][0]).toBe("\"Encounter Id\" 5 is invalid");
	});

	test('When some encounters are someone else\'s', async () => {
		const response = await campaignFactory.Edit({
			payload: {
				"Id": 1,
				"Name": "same name",
				"Summary": "same summary",
				"Encounters": [
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
		expect(response['messages'][0]).toBe("\"Encounter Id\" 2 is invalid");
	});

	test('When a new set of valid characters is provided to change', async () => {
		const response = await campaignFactory.Edit({
			payload: {
				"Id": 2,
				"Name": "same name",
				"Summary": "same summary",
				"Characters": [
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
    	expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1)
		expect(response['messages'][0]).toBe("success");
	});

	test('When some characters are invalid within a given set of characters', async () => {
		const response = await campaignFactory.Edit({
			payload: {
				"Id": 1,
				"Name": "same name",
				"Summary": "same summary",
				"Characters": [
					{"Id": 5}
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
		expect(response['messages'][0]).toBe("\"Character Id\" 5 is invalid");
	});

	test('When some characters are someone else\'s', async () => {
		const response = await campaignFactory.Edit({
			payload: {
				"Id": 1,
				"Name": "same name",
				"Summary": "same summary",
				"Characters": [
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
		expect(response['messages'][0]).toBe("\"Character Id\" 2 is invalid");
	});

	test('When requester is not the creator of the campaign', async () => {
		const response = await campaignFactory.Edit({
			payload: {
				"Id": 3,
				"Name": "same name",
				"Summary": "same summary",
				"Encounters": [
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
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1)
    	expect(response['messages'][0]).toBe("Requester is not the owner.");
	});

	test('When no campaign with given id', async () => {
		const response = await campaignFactory.Edit({
			payload: {
				"Id": 4,
				"Name": "same name",
				"Summary": "same summary",
        		"Encounters": [
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
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1)
		expect(response['messages'][0]).toBe("Campaign is not found.");
	});
});
