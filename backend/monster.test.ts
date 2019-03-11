import {MonsterFactory} from "./monster";

jest.mock("./entity/AbilityScore");
jest.mock("./entity/Monster");
jest.mock("./entity/MonsterAbilityScore");
jest.mock("./entity/MonsterSavingThrow");
jest.mock("./entity/MonsterSkill");
jest.mock("./entity/Skill");
jest.mock("./entity/Action");

describe('monster creation tests', async () => {
	var monster = new MonsterFactory();

	test('when proper data is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Senses": "test sense",
				"Languages": "test languages",
				"HitPoints": 13,
				"DamageVulnerabilities": "test",
				"DamageResistances": "test",
				"DamageImmunities": "test",
				"ConditionImmunities": "test",
				"Size": "Tiny",
				"Type": "Fiend",
				"Race": "Human",
				"Environment": "Mountain",
				"Alignment": "LawfulEvil",
				"ArmorClass": 5,
				"HitPointDistribution": "2d8",
				"Speed": "20 ft.",
				"ChallengeRating": 1,
				"AbilityScores": {
					"Strength": 20,
					"Charisma": 3
				},
				"SavingThrows": {
					"Strength": 20,
					"Charisma": 3,
					"Constitution": 12
				},
				"Skills": [
					{
						"Name": "A",
						"Bonus": 10
					},{
						"Name": "B",
						"Bonus": 0
				}]
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("success");
	});

	test('when only name is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("success");
	});

	test('when name is not given', async () => {
		const response = await monster.Create({
			payload: {
				"Senses": "test sense",
				"Languages": "test languages",
				"HitPoints": 13,
				"DamageVulnerabilities": "test",
				"DamageResistances": "test",
				"DamageImmunities": "test",
				"ConditionImmunities": "test",
				"Size": "Tiny",
				"Type": "Fiend"
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Name\" is required");
	});


	test('when an invalid monster size is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "test",
				"Size": "InvalidSize",
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Size\" must be one of Tiny,Small,Medium,Large,Huge,Gargantuan");
	});

	test('when an invalid monster type is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "test",
				"Type": "InvalidType"
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Type\" must be one of Beast,Dragon,Monstrosity,Humanoid,Fiend,Undead,Giant,Elemental,SwarmOfTinyBeasts,Construct,Celestial,Aberration,Fey,Plant,Ooze");
	});

	test('when an invalid monster race is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "test",
				"Race": "InvalidRace"
			},
		});
		
		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Race\" must be one of AnyRace,Devil,Demon,Human,Shapechanger,Goblinoid,Titan,Gnoll,Gnome,Dwarf,Elf,Orc,Kobold,Lizardfolk,Merfolk,Sahuagin,Grimlock");
	});

	test('when an invalid monster alignment is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "test",
				"Alignment": "InvalidAlignment"
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Alignment\" must be one of Unaligned,AnyAlignment,AnyNonGoodAlignment,AnyNonEvilAlignment,AnyNonLawfulAlignment,AnyNonChaoticAlignment,AnyGoodAlignment,AnyEvilAlignment,AnyLawfulAlignment,AnyChaoticAlignment,AnyNeutralAlignment,LawfulGood,LawfulNeutral,LawfulEvil,NeutralGood,Neutral,NeutralEvil,ChaoticGood,ChaoticNeutral,ChaoticEvil");
	});

	test('when an invalid monster environment is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "test",
				"Environment": "InvalidEnvironment"
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Environment\" must be one of Arctic,Coastal,Desert,Forest,Grassland,Hill,Mountain,Swamp,Underdark,Underwater,Urban");
	});

	test('when no AbilityScores, Skills and SavingThrows is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Senses": "test sense",
				"Languages": "test languages",
				"HitPoints": 13,
				"DamageVulnerabilities": "test",
				"DamageResistances": "test",
				"DamageImmunities": "test",
				"ConditionImmunities": "test",
				"Size": "Tiny",
				"Type": "Fiend"
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("success");
	});

	test('when an invalid Skill is given for MonsterSkills', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Skills": [{
					"Name":"C",
					"Bonus": 3
				}]
			},
		});

		expect.assertions(4);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Skill Name\" must be one of A,B");
		expect(response['messages'][1]).toBe("Invalid Skill Names values: C");		
	});

	test('when a valid Skill is given for MonsterSkills but the Bonus field is invalid', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Skills": [{
					"Name":"A",
					"Bonus": "testing"
				}]
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Skill Bonus\" must be a number");
		expect(response['messages'][1]).toBe("Invalid Skill Bonus values: testing");
	});

	test('when an invalid Strength is given for AbilityScores', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"AbilityScores": {
					"Strength": "test"
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Strength\" must be a number");		
	});

	test('when an invalid Dexterity is given for AbilityScores', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"AbilityScores": {
					"Dexterity": "test"
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Dexterity\" must be a number");
	});

	test('when an invalid Constitution is given for AbilityScores', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"AbilityScores": {
					"Constitution": "test"
				}
			},
		});
		
		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Constitution\" must be a number");
	});

	test('when an invalid Intelligence is given for AbilityScores', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"AbilityScores": {
					"Intelligence": "test"
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Intelligence\" must be a number");
	});

	test('when an invalid Wisdom is given for AbilityScores', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"AbilityScores": {
					"Wisdom": "test"
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Wisdom\" must be a number");
	});

	test('when an invalid Wisdom is given for AbilityScores', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"AbilityScores": {
					"Charisma": "test"
				}
			},
		});
		
		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Charisma\" must be a number");
	});


	test('when an invalid Strength is given for SavingThrows', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"SavingThrows": {
					"Strength": "test"
				}
			},
		});
		
		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Strength\" must be a number");
	});

	test('when an invalid Dexterity is given for SavingThrows', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"SavingThrows": {
					"Dexterity": "test"
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Dexterity\" must be a number");
	});

	test('when an invalid Constitution is given for SavingThrows', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"SavingThrows": {
					"Constitution": "test"
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Constitution\" must be a number");
	});

	test('when an invalid Intelligence is given for SavingThrows', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"SavingThrows": {
					"Intelligence": "test"
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Intelligence\" must be a number");
	});

	test('when an invalid Wisdom is given for SavingThrows', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"SavingThrows": {
					"Wisdom": "test"
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Wisdom\" must be a number");	
	});

	test('when an invalid Charisma is given for SavingThrows', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"SavingThrows": {
					"Charisma": "test"
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Charisma\" must be a number");
	});

	test('when name is not provided for an action', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Actions": [
					{
						"Description": "Something"
				    }
				]
			},
		});
		
		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("Name must be provided for each action.");
	});

	test('when name is not provided for an action', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Actions": [
					{
						"Name": "Something"
				    }
				]
			},
		});
		
		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("Description must be provided for each action.");
	});

	test('when invalid HitBonus is provided for an action', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Actions": [
					{
						"Name": "Something",
						"Description": "Something",
						"HitBonus": "test"
				    }
				]
			},
		});
		
		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("HitBonus is invalid: test");
	});

	test('when invalid DamageBonus is provided for an action', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Actions": [
					{
						"Name": "Something",
						"Description": "Something",
						"DamageBonus": "test"
				    }
				]
			},
		});
		
		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("DamageBonus is invalid: test");
	});

	test('when invalid Type is provided for an action', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Actions": [
					{
						"Name": "Something",
						"Description": "Something",
						"Type": "test"
				    }
				]
			},
		});
		
		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("Type is invalid for action: test");
	});

	test('when proper payload is provided for an action', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Actions": [
					{
						"Name": "Something",
						"Description": "Something",
						"Type": "LegendaryAction",
						"Damage": "3d6"
				    }
				]
			},
		});
		
		expect.assertions(3);
		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("success");
	});
	/*
	Monster action tests

	When valid monster actions are given
	return success

	When invalid monster actions are given
	return an error
	*/

});
