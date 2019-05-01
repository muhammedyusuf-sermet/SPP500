
import { ICampaignData } from './campaign';

let campaignExample: ICampaignData;
campaignExample = {
	Id: 1,
	Name: "Campaign",
	Summary: "Bloody hell...",
	Notes: "You gonna die!",
	Encounters: [],
	Characters: []
};

export const CampaignInstances: ICampaignData[] = new Array();

// Generate a dummy array of encounters with different IDs
for (var i = 0; i < 12; i++) {
	let encounter = {} as ICampaignData;
	Object.assign(encounter, campaignExample);
	encounter.Id = i + 1;
	CampaignInstances.push(encounter);
}