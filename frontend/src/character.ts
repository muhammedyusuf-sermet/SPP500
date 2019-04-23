import { ICampaignState } from "./campaign";

export enum CharacterRace {
	Dragonborn = "Dragonborn",
	Dwarf = "Dwarf",
	Elf = "Elf",
	Gnome = "Gnome",
	HalfElf = "HalfElf",
	Halfling = "Halfling",
	HalfOrc = "HalfOrc",
	Human = "Human",
	Tiefling = "Tiefling"
}

export enum CharacterClass {
	Barbarian = "Barbarian",
	Bard = "Bard",
	Cleric = "Cleric",
	Druid = "Druid",
	Fighter = "Fighter",
	Monk = "Monk",
	Paladin = "Paladin",
	Ranger = "Ranger",
	Rogue = "Rogue",
	Sorcerer = "Sorcerer",
	Warlock = "Warlock",
	Wizard = "Wizard"
}

export interface ICharacterData {
	Id?: number;
	Name: string;
	Level?: number;
	Race?: CharacterRace;
	Class?: CharacterClass;
	MaxHealth?: number;
	ArmorClass?: number;
	Notes?: string;

	Campaigns?: ICampaignState[];
}
