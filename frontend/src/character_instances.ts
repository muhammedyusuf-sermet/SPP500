import { CharacterRace, CharacterClass, ICharacterData } from "./character";


let characterExample: ICharacterData;
characterExample = {
	Id: 0,
	Name: "Character",
	Level: 3,
	Race: CharacterRace.Gnome,
	Class: CharacterClass.Paladin,
	MaxHealth: 23,
	ArmorClass: 12,
	Notes: 'aggressive',

	Campaigns: []
};

export const CharacterInstances: ICharacterData[] = new Array();

// Generate a dummy array of characters with different IDs
for (var i = 0; i < 12; i++) {
	let character = {} as ICharacterData;
	Object.assign(character, characterExample);
	character.Id = i
	CharacterInstances.push(character);
}