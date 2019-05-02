import { Encounter } from "./entity/Encounter"
import { User } from "./entity/User"
import { Campaign } from "./entity/Campaign"

import { CampaignFactory } from "./campaign";

jest.mock("./entity/Campaign");
jest.mock("./entity/Encounter");
jest.mock("./entity/Character");
jest.mock("./entity/User");

describe('campaign delete tests', async () => {
	beforeAll( async () => {
		Campaign.clear();
		Encounter.clear();

		let user = new User();
		user.Name = "John Doe";
		user.Id = 1;
		await user.save();

		let user2 = new User();
		user2.Name = "Jane Doe";
		user2.Id = 2;
		await user2.save();
	
		let encounter = new Encounter();
		encounter.Name = "John Doe's Encounter";
		encounter.Id = 1;
		encounter.Creator = user;
		await encounter.save();

		let encounter2 = new Encounter();
		encounter2.Name = "Jane Doe's Encounter";
		encounter2.Id = 2;
		encounter2.Creator = user2;
		await encounter2.save();

		const campaign = new Campaign();
		campaign.Name = "Test1";
		campaign.Id = 1;
		campaign.Creator = user;
		campaign.Encounters = [encounter];
		await campaign.save();

		const campaign3 = new Campaign();
		campaign3.Name = "Test3";
		campaign3.Id = 3;
		campaign3.Creator = user;
		campaign3.Encounters = [encounter];
		await campaign3.save();

		const campaign2 = new Campaign();
		campaign2.Name = "Test1";
		campaign2.Id = 2;
		campaign2.Creator = user2;
		campaign2.Encounters = [encounter2];
		await campaign2.save();

	});

	var campaign = new CampaignFactory();

	test('when campaign Id is given properly first campaign', async () => {
		const response = await campaign.Delete({
			params: {
				campaignId: 1
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});
		
		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe('success');
		expect((await Campaign.find({ Id: 1 }))).toEqual([]);
	});

	test('when requester is not the creator of the campaign', async () => {
		const response = await campaign.Delete({
			params: {
				campaignId: 2
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});
		
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe('Requester is not the owner.');
	});

	test('when campaign Id is given properly but no campaign', async () => {
		const response = await campaign.Delete({
			params: {
				campaignId: 4
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});
		
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe('Campaign is not found.');
	});

	test('when campaign Id parameter is not number', async () => {
		const response = await campaign.Delete({
			params: {
				campaignId: 'test'
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});
		
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("Parameter 'campaignId' must be a number.");
	});

	test('when campaign Id is given properly', async () => {
		const response = await campaign.GetOne({
			params: {
				campaignId: 3
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

	test('when campaign Id is nan', async () => {
		const response = await campaign.GetOne({
			params: {
				campaignId: "test"
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});
		
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("Parameter 'campaignId' must be a number.");
	});

	test('when there is no campaign with that campaign Id', async () => {
		const response = await campaign.GetOne({
			params: {
				campaignId: 4
			},
			auth: {
				credentials: {
					id: 1
				}
			}
		});
		
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("Campaign is not found.");
	});

	test('when requester is not the owner', async () => {
		const response = await campaign.GetOne({
			params: {
				campaignId: 2
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

//get one campaign pseudo tests
//when campaign Id parameter is not number
//raise an error

//when campaign Id is given properly but no campaign
//raise an error

//when campaign Id is given properly
//return the campaign
