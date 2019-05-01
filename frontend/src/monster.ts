export enum Size {
	Tiny = "Tiny",
	Small = "Small",
	Medium = "Medium",
	Large = "Large",
	Huge = "Huge",
	Gargantuan = "Gargantuan"
}

export enum MonsterType {
	Beast = "Beast",
	Dragon = "Dragon",
	Monstrosity = "Monstrosity",
	Humanoid = "Humanoid",
	Fiend = "Fiend",
	Undead = "Undead",
	Giant = "Giant",
	Elemental = "Elemental",
	SwarmOfTinyBeasts = "SwarmOfTinyBeasts",
	Construct = "Construct",
	Celestial = "Celestial",
	Aberration = "Aberration",
	Fey = "Fey",
	Plant = "Plant",
	Ooze = "Ooze"
}

export enum MonsterRace {
	AnyRace = "AnyRace",
	Devil = "Devil",
	Demon = "Demon",
	Human = "Human",
	Shapechanger = "Shapechanger",
	Goblinoid = "Goblinoid",
	Titan = "Titan",
	Gnoll = "Gnoll",
	Gnome = "Gnome",
	Dwarf = "Dwarf",
	Elf = "Elf",
	Orc = "Orc",
	Kobold = "Kobold",
	Lizardfolk = "Lizardfolk",
	Merfolk = "Merfolk",
	Sahuagin = "Sahuagin",
	Grimlock = "Grimlock"
}

export enum Alignment {
	Unaligned = "Unaligned",
	AnyAlignment = "AnyAlignment",
	AnyNonGoodAlignment = "AnyNonGoodAlignment",
	AnyNonEvilAlignment = "AnyNonEvilAlignment",
	AnyNonLawfulAlignment = "AnyNonLawfulAlignment",
	AnyNonChaoticAlignment = "AnyNonChaoticAlignment",
	AnyGoodAlignment = "AnyGoodAlignment",
	AnyEvilAlignment = "AnyEvilAlignment",
	AnyLawfulAlignment = "AnyLawfulAlignment",
	AnyChaoticAlignment = "AnyChaoticAlignment",
	AnyNeutralAlignment = "AnyNeutralAlignment",
	LawfulGood = "LawfulGood",
	LawfulNeutral = "LawfulNeutral",
	LawfulEvil = "LawfulEvil",
	NeutralGood = "NeutralGood",
	Neutral = "Neutral",
	NeutralEvil = "NeutralEvil",
	ChaoticGood = "ChaoticGood",
	ChaoticNeutral = "ChaoticNeutral",
	ChaoticEvil = "ChaoticEvil"
}

export enum Environment {
	Arctic = "Arctic",
	Coastal = "Coastal",
	Desert = "Desert",
	Forest = "Forest",
	Grassland = "Grassland",
	Hill = "Hill",
	Mountain = "Mountain",
	Swamp = "Swamp",
	Underdark = "Underdark",
	Underwater = "Underwater",
	Urban = "Urban"
}

export enum MonsterAction {
	SpecialAbility = "SpecialAbility",
	Action = "Action",
	LegendaryAction = "LegendaryAction"
}

export interface IMonsterAbilities {
	name: string,
	description: string,
}

export enum TypeOfAction {
	Ranged = "Ranged",
	Melee = "Melee",
}

export interface IMonsterActions {
	name: string,
	description: string,
	usageCount: number,
	legendaryAction: boolean,
	typeOfAction?: TypeOfAction,
	toHit: number,
	reach: number,
	targets: number,
	averagedDamage: number,
	damageDice: number,
	damageConstant: number,
}

export interface IMonsterData {
	Id?: number,
	Name: string,
	Size?: Size | string;
	Type?: MonsterType | string;
	Race?: MonsterRace | string;
	Environment?: Environment | string;
	Alignment?: Alignment | string;

	ArmorClass?: number;
	HitPoints?: number;
	HitPointDistribution?: string;

	Speed?: string;
	Languages?: string;

	DamageVulnerabilities?: string;
	DamageResistances?: string;
	DamageImmunities?: string;
	ConditionImmunities?: string;

	ChallengeRating?: number;

	AbilityScores: IMonsterAbilityScore;
	Senses: SenseMap;
	Skills: SkillMap;
	SavingThrows: IMonsterSavingThrow;
	//Actions: IActionState[];
}

export interface SkillMap {
	[skillName: string]: number|undefined;
}

export interface SenseMap {
	[senseName: string]: number|undefined;
}

export interface IMonsterAbilityScore {
	[index:string]: number|undefined;
	Strength?: number;
	Dexterity?: number;
	Constitution?: number;
	Intelligence?: number;
	Wisdom?: number;
	Charisma?: number;
}

export interface IMonsterSavingThrow {
	[index:string]: number|undefined;
	Strength?: number;
	Dexterity?: number;
	Constitution?: number;
	Intelligence?: number;
	Wisdom?: number;
	Charisma?: number;
}

export interface IActionState {
	Name: string,
	Description: string,
	HitBonus?: number,
	Damage?: string,
	DamageBonus?: number,
	Type?: MonsterAction
}