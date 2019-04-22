import * as Campaign from "./campaign";

// Dummy array of monsters
import EncounterInstances from './encounter_instances';

let encounterExample: Campaign.ICampaignState;
encounterExample = {
	Id: 0,
	Name: "Campaign",
	Summary: "Bloody hell...",
	Notes: "You gonna die!",
	Encounters: EncounterInstances['EncounterInstances'],
};

let CampaignInstances = new Array();

// Generate a dummy array of encounters with different IDs
for (var i = 0; i < 12; i++) {
	let encounter = {} as Campaign.ICampaignState;
	Object.assign(encounter, encounterExample);
	encounter['Id'] = i;
	CampaignInstances.push(encounter);
}

export default {
    CampaignInstances,
}