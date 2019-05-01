import { IEncounterData } from "./encounter";

let encounterExample: IEncounterData;
encounterExample = {
	Id: 1,
	Name: "Encounter",
	Description: "This is a fierce encounter...",
	Monsters: [],
};

export const EncounterInstances: IEncounterData[] = new Array();

// Generate a dummy array of encounters with different IDs
for (var i = 0; i < 12; i++) {
	let encounter = {} as IEncounterData;
	Object.assign(encounter, encounterExample);
	encounter.Id = i + 1;
	EncounterInstances.push(encounter);
}