import { Encounter } from "./entity/Encounter"
import { User } from "./entity/User"
import { Campaign } from "./entity/Campaign"
import { Character } from "./entity/Character";

import { CampaignFactory } from "./campaign";

jest.mock("./entity/Campaign");
jest.mock("./entity/Encounter");
jest.mock("./entity/Character");
jest.mock("./entity/User");

describe('campaign tests', async () => {
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
		character2.Creator = user2;
		await character2.save();
	
		const campaign3 = new Campaign();
		campaign3.Name = "Test3";
		campaign3.Id = 3;
		campaign3.Creator = user2;
		campaign3.Encounters = [encounter2];
		campaign3.Characters = [character2];
		await campaign3.save();
	});

	describe('campaign creation tests', async () => {

		var campaign = new CampaignFactory();

		test('when proper data is given', async () => {
			const response = await campaign.Create({
				payload: {
					"Name": "Test",
					"Summary": "Test",
					"Encounters": [
						{ "Id": 1 }
					],
					"Characters": [
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
		test('when no encounter is provided', async () => {
			const response = await campaign.Create({
				payload: {
					"Name": "Test",
					"Summary": "Test",
					"Notes": "Test"
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
			const response = await campaign.Create({
				payload: {
					"Summary": "Test"
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

		test('when summary is not provided', async () => {
			const response = await campaign.Create({
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

		test('when an empty string is provided as the name', async () => {
			const response = await campaign.Create({
				payload: {
					"Name": "",
					"Summary": "Test"
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

		test('when credentials dont match the encounter', async () => {
			const response = await campaign.Create({
				payload: {
					"Name": "Test",
					"Summary": "Test",
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

		test('when invalid encounter is given', async () => {
			const response = await campaign.Create({
				payload: {
					"Name": "Test",
					"Summary": "Test",
					"Encounters": [
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
			expect(response['messages'][0]).toBe("\"Encounter Id\" 4 is invalid");
		});

		test('when credentials match the encounter', async () => {
			const response = await campaign.Create({
				payload: {
					"Name": "Test",
					"Summary": "Test",
	        		"Encounters": [
						{"Id": 2}
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

		test('when credentials dont match the character', async () => {
			const response = await campaign.Create({
				payload: {
					"Name": "Test",
					"Summary": "Test",
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

		test('when invalid character is given', async () => {
			const response = await campaign.Create({
				payload: {
					"Name": "Test",
					"Summary": "Test",
					"Characters": [
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
			expect(response['messages'][0]).toBe("\"Character Id\" 4 is invalid");
		});

		test('when credentials match the character', async () => {
			const response = await campaign.Create({
				payload: {
					"Name": "Test",
					"Summary": "Test",
	        		"Characters": [
						{"Id": 2}
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

	describe('campaign get tests', async () => {
		beforeAll( async () => {
			Campaign.clear();

			const user = new User();
			user.Name = "John Doe";
			user.Id = 1;
			await user.save();

			const campaign = new Campaign();
			campaign.Id = 1;
			campaign.Name = "Test Name";
			campaign.Summary = "Test Summary";
			campaign.Creator = user;
			await campaign.save();

	 		const campaign2 = new Campaign();
			campaign2.Id = 2;
			campaign2.Name = "Test Name";
			campaign2.Summary = "Test Summary";
			campaign2.Creator = user;
			await campaign2.save();

			const campaign3 = new Campaign();
			campaign3.Id = 3;
			campaign3.Name = "Test Name";
			campaign3.Summary = "Test Summary";
			campaign3.Creator = user;
			await campaign3.save();
		});

		var campaignFactory = new CampaignFactory();

		test('when page number and page size is given properly for first page', async () => {
			const response = await campaignFactory.GetMany({
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
			const response = await campaignFactory.GetMany({
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
			const response = await campaignFactory.GetMany({
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
			const response = await campaignFactory.GetMany({
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
});
//get one campaign pseudo tests
//when campaign Id parameter is not number
//raise an error

//when campaign Id is given properly but no campaign
//raise an error

//when campaign Id is given properly
//return the campaign
