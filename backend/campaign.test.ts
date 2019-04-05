import {Encounter} from "./entity/Encounter"
import {User} from "./entity/User"
import {Campaign} from "./entity/Campaign"

import {CampaignFactory} from "./campaign";

jest.mock("./entity/Campaign");
jest.mock("./entity/Encounter");
jest.mock("./entity/User");

describe('campaign tests', async () => {
	beforeAll( async () => {
		let user = new User();
		user.Name = "John Doe";
		user.Id = 1;
		await user.save();
	
		let encounter = new Encounter();
		encounter.Name = "John Doe's Encounter";
		encounter.Id = 1;
		encounter.Creator = user;
		await encounter.save();

		const campaign = new Campaign();
		campaign.Name = "Test1";
		campaign.Id = 1;
		campaign.Creator = user;
		campaign.Encounters = [encounter];
		await campaign.save();

		user = new User();
		user.Name = "Other John Doe";
		user.Id = 2;
		await user.save();

		encounter = new Encounter();
		encounter.Name = "Other John Doe's Encounter";
		encounter.Id = 2;
		encounter.Creator = user;
		await encounter.save();
    
    	
	});
	describe('campaign edit tests', async () => {

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
			expect(response['messages'][0]).toBe("Name should not be an empty string.");
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
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1)
			expect(response['messages'][0]).toBe("Summary should not be an empty string.");
		});

		test('When a new set of valid encounters is provided to change', async () => {
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
			expect(response['messages'][0]).toBe("Encounter is invalid: 3");
		});

		test('When requester is not the creator of the campaign', async () => {
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
	         			id: 2
					}
	        	}
			});

			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1)
	    	expect(response['messages'][0]).toBe("Requester is not the creator of this campaign.");
		});

		test('When no campaign with given id', async () => {
			const response = await campaignFactory.Edit({
				payload: {
					"Id": 2,
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
			expect(response['messages'][0]).toBe("There is no such campaign saved.");
		});

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
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1)
			expect(response['messages'][0]).toBe("\"Summary\" is required");
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
			expect(response['messages'][0]).toBe("\"Encounter Id\" 3 is invalid");
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
	});


	describe('campaign delete tests', async () => {
	 	var campaignFactory = new CampaignFactory();

	 	test('When another user requests a campaign to be deleted when they are not the owner', async () => {
			const response = await campaignFactory.Delete({
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
			expect(response['messages'][0]).toBe("Requester is not the creator of this campaign.");
		});

	 	test('When owner of an campaign requests delete', async () => {
			const response = await campaignFactory.Delete({
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

		test('When an invalid campaign is given', async () => {
			const response = await campaignFactory.Delete({
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
			expect(response['messages'][0]).toBe("There is no such campaign saved.");
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
			const response = await campaignFactory.GetAll({
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
			const response = await campaignFactory.GetAll({
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
			const response = await campaignFactory.GetAll({
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
			const response = await campaignFactory.GetAll({
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
