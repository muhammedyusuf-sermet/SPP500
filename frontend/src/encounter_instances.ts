import * as Encounter from "./encounter";

// Dummy array of monsters
import MonsterInstances from './monster_instances';

let encounterExample: Encounter.IEncounterState;
encounterExample = {
	Id: "",
	Name: "Encounter",
	Description: "This is a fierce encounter...",
	Monsters: MonsterInstances['MonsterInstances'],
};

let EncounterInstances = new Array();

// Generate a dummy array of encounters with different IDs
for (var i = 0; i < 12; i++) {
	let encounter = {} as Encounter.IEncounterState;
	Object.assign(encounter, encounterExample);
	encounter['Id'] = i.toString();
	EncounterInstances.push(encounter);
}

export default {
    EncounterInstances,
}