import {Encounter} from "./entity/Encounter"
import {User} from "./entity/User"
import {Campaign} from "./entity/Campaign"

import {CampaignFactory} from "./campaign";

jest.mock("./entity/Campaign");
jest.mock("./entity/Encounter");
jest.mock("./entity/User");

describe('campaign edit tests', async () => {
	beforeAll( async () => {
		const encounter = new Encounter();
		encounter.Name = "Test1";
		encounter.Id = 1;
		await encounter.save();

		const encounter2 = new Encounter();
		encounter2.Name = "Test2";
		encounter2.Id = 2;
		await encounter2.save();

		const user = new User();
		user.Name = "John Doe";
		user.Id = 1;
		await user.save();

		const campaign = new Campaign();
		campaign.Name = "Test1";
		campaign.Id = 1;
		campaign.Creator = user;
		campaign.Encounters = [encounter];
		await campaign.save();

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

/*
Edit campaign tests

When data is valid
Return success

When invalid encounter is added
Return error

When unauthorized user requests change
Return error

*/