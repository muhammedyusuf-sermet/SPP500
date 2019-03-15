import * as Monster from "./monster";

// TODO: we might want to add "id" field to the IMonster interface.
let monsterExample: Monster.IMonster;
monsterExample = {
			id: "",
			name: "Kobold",
			type: Monster.MonsterType.Celestial,
			alignment: Monster.MonsterAlignment.AnyGoodAlignment,
			size: Monster.MonsterSize.Gargantuan,
			race: Monster.MonsterRace.Devil,
			environment: Monster.MonsterEnvironment.Underdark,
			resistance: "Everything",
			damageImmunity: "None at all",
			conditionImmunity: "Nada",
			vulnerability: "Nothing",
			armorClass: 15,
			hitPoints: 40,
			hitPointDice: "9d5",
			hitPointDiceAdd: -5,
			speedLand: 25,
			speedSwim: 15,
			strStat: 17,
			dexStat: 15,
			conStat: 13,
			intStat: 12,
			wisStat: 16,
			chaStat: 15,
			strSavingThrow: -3,
			dexSavingThrow: 0,
			conSavingThrow: -1,
			intSavingThrow: -2,
			wisSavingThrow: 8,
			chaSavingThrow: 9,
			skillsAthletics: 9,
			skillsAcrobatics: 10,
			skillsSleightOfHand: 9,
			skillsStealth: 8,
			skillsArcana: 7,
			skillsHistory: 7,
			skillsInvestigation: 6,
			skillsNature: 7,
			skillsReligion: 8,
			skillsAnimalHandling: 9,
			skillsInsight: 10,
			skillsMedicine: 12,
			skillsPerception: 15,
			skillsSurvival: 11,
			skillsDeception: 10,
			skillsIntimidation: 9,
			skillsPerformance: 7,
			skillsPersuasion: 4,
			sensesBlindsight: 30,
			sensesDarkvision: 10,
			sensesTremorsense: 15,
			sensesTruesight: 60,
			sensesPassivePerception: 13,
			sensesPassiveInvestigation: 14,
			sensesPassiveInsight: 16,
			languages: "Common and Draconic",
			challengeRating: 2.5,
			experiencePoints: 190,
			abilities: [],
			actions: [],
		}

let MonsterInstances = new Array();

// Generate a dummy array of monsters with different IDs
for (var i = 0; i < 12; i++) {
	let monster = {} as Monster.IMonster;
	Object.assign(monster, monsterExample);
	monster['id'] = i.toString();
	MonsterInstances.push(monster);
}

export default {
    MonsterInstances,
}