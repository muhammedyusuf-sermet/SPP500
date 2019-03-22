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

export interface IMonsterState {
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

	AbilityScores: IMonsterAbilityScoreState;
	Senses: SenseMap;
	Skills: SkillMap;
	SavingThrows: IMonsterSavingThrowState;
	//Actions: IActionState[];
}

export interface IMonsterErrorState {
	Name?: string;
	Size?: string;
	Type?: string;
	Race?: string;
	Environment?: string;
	Alignment?: string;

	ArmorClass?: string;
	HitPoints?: string;
	HitPointDistribution?: string;

	Speed?: string;
	Languages?: string;

	DamageVulnerabilities?: string;
	DamageResistances?: string;
	DamageImmunities?: string;
	ConditionImmunities?: string;

	ChallengeRating?: string;

	AbilityScores: { [key: string]: string }
	Senses: { [key: string]: string };
	Skills: { [key: string]: string };
	SavingThrows: { [key: string]: string };
	//Actions: { [key: string]: string };
}

export interface SkillMap {
	[skillName: string]: number|undefined;
}

export interface SenseMap {
	[senseName: string]: number|undefined;
}

export interface IMonsterAbilityScoreState {
	[index:string]: number|undefined;
	Strength?: number;
	Dexterity?: number;
	Constitution?: number;
	Intelligence?: number;
	Wisdom?: number;
	Charisma?: number;
}

export interface IMonsterSavingThrowState {
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
/*export interface IMonster {
	name: string,
	type: MonsterType,
	alignment: MonsterAlignment,
	size: MonsterSize,
	race: MonsterRace,
	environment: MonsterEnvironment,
	resistance?: string,
	damageImmunity?: string,
	conditionImmunity?: string,
	vulnerability?: string,
	armorClass: number,
	hitPoints?: number,
	hitPointDice?: string,
	hitPointDiceAdd?: number,
	speedLand: number,
	speedSwim?: number,
	strStat: number,
	dexStat: number,
	conStat: number,
	intStat: number,
	wisStat: number,
	chaStat: number,
	strSavingThrow?: number,
	dexSavingThrow?: number,
	conSavingThrow?: number,
	intSavingThrow?: number,
	wisSavingThrow?: number,
	chaSavingThrow?: number,
	skillsAthletics: number,
	skillsAcrobatics?: number,
	skillsSleightOfHand?: number,
	skillsStealth?: number,
	skillsArcana?: number,
	skillsHistory?: number,
	skillsInvestigation?: number,
	skillsNature?: number,
	skillsReligion?: number,
	skillsAnimalHandling?: number,
	skillsInsight?: number,
	skillsMedicine?: number,
	skillsPerception?: number,
	skillsSurvival?: number,
	skillsDeception?: number,
	skillsIntimidation?: number,
	skillsPerformance?: number,
	skillsPersuasion?: number,
	sensesBlindsight?: number,
	sensesDarkvision?: number,
	sensesTremorsense?: number,
	sensesTruesight?: number,
	sensesPassivePerception?: number,
	sensesPassiveInvestigation?: number,
	sensesPassiveInsight?: number,
	languages?: string,
	challengeRating: number,
	experiencePoints: number,
	abilities?: IMonsterAbilities[],
	actions?: IMonsterActions[],
}*/