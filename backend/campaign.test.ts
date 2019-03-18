import {Encounter} from "./entity/Encounter"
import {User} from "./entity/User"

import {CampaignFactory} from "./campaign";

jest.mock("./entity/Campaign");
jest.mock("./entity/Encounter");
jest.mock("./entity/User");

describe('campaign creation tests', async () => {
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

	var campaign = new CampaignFactory();

	test('when proper data is given', async () => {
		const response = await campaign.Create({
			payload: {
				"Name": "Test",
				"Summary": "Test",
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

/*

When all info provided correctly
Save the campaign

When invalid encounter is provided
raise an error

When name summary or Notes are invalid
raise an error

*/