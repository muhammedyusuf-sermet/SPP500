import {MonsterFactory} from "./monster";
import {Monster} from "./entity/Monster"
import { MonsterSkill } from "./entity/MonsterSkill";
import { Skill } from "./entity/Skill";
import { Sense } from "./entity/Sense";
import { MonsterSense } from "./entity/MonsterSense";

jest.mock("./entity/AbilityScore");
jest.mock("./entity/Monster");
jest.mock("./entity/MonsterAbilityScore");
jest.mock("./entity/MonsterSavingThrow");
jest.mock("./entity/MonsterSkill");
jest.mock("./entity/Skill");
jest.mock("./entity/Action");
jest.mock("./entity/MonsterSense");
jest.mock("./entity/Sense");

describe('monster creation tests', async () => {
	var monster = new MonsterFactory();

	test('when proper data is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
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
				"Senses": {
					"A sense": 100,
					"B sense": 12
				},
				"Skills": {
					"A": 10,
					"B": 0
				}
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
				"Skills": {
					"C": 3
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Skill Name\" must be one of A,B");
	});
	
	test('when an invalid Sense is given for MonsterSenses', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Senses": {
					"C": 3
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Sense Name\" must be one of A sense,B sense");
	});

	test('when a valid Skill is given for MonsterSkills but the Bonus field is invalid', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Skills": {
					"A": "testing"
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Skill Bonus\" must be a number");
	});

	test('when a valid Sense is given for MonsterSenses but the Bonus field is invalid', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Senses": {
					"A sense": "testing"
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Sense Bonus\" must be a number");
	});

	test('when a valid Skill is given for MonsterSkills', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Skills": {
					"A": 3
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("success");
	});

	test('when a valid Sense is given for MonsterSenses', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Senses": {
					"A sense": 3
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("success");
	});
	
	test('when a valid Skill is given for MonsterSkills but Skills is an array', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Skills": [{
					"A": 3
				}]
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Skills\" must be an object");
	});

	test('when a valid Sense is given for MonsterSenses but Senses is an array', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Senses": [{
					"A sense": 3
				}]
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Senses\" must be an object");
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

	test('when Actions is an object', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Actions": {
					"0": {
						"Name": "Test",
						"Description": "Something"
				    }
				}
			},
		});
		
		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Actions\" must be an array");
	});

	test('when Actions is an array containing arrays', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Actions": [
					[
						"Name", "Test",
						"Description", "Something"
					]
				]
			},
		});
		
		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Action Items\" must be an object");
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
		expect(response['messages'][0]).toBe("\"Name\" is required");
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
		expect(response['messages'][0]).toBe("\"Description\" is required");
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
		expect(response['messages'][0]).toBe("\"HitBonus\" must be a number");
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
		expect(response['messages'][0]).toBe("\"DamageBonus\" must be a number");
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
		expect(response['messages'][0]).toBe("\"Type\" must be one of SpecialAbility,Action,LegendaryAction");
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

describe('monster edit tests', async () => {
	beforeAll( async () => {
		Monster.clear();

		const monster = new Monster();
		monster.Name = "John Doe";
		monster.Id = 0;
		await monster.save();

		const monster2 = new Monster();
		monster2.Name = "John Doe";
		monster2.Id = 1;
		await monster2.save();

		const monster3 = new Monster();
		monster3.Name = "John Doe";
		monster3.Id = 2;
		await monster3.save();
	});

	var monster = new MonsterFactory();

	test('when proper data is given', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
				"Name": "Test",
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
				"Senses": {
					"A sense": 100,
					"B sense": 12
				},
				"Skills": {
					"A": 10,
					"B": 0
				}
			}
		});

		expect.assertions(3);
		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("success");
	});

	test('when monster Id is given properly but no monster', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 4,
				"Name": "Test",
			}
		});
		
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe('Monster not found.');
	});

	test('when only name is given', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
				"Name": "Test",
			}
		});

		expect.assertions(3);
		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("success");
	});

	test('when name is not given', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
				"Name": "Test",
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
		const response = await monster.Edit({
			payload: {
				"Id": 2,
				"Name": "Test",
				"Skills": {
					"C": 3
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Skill Name\" must be one of A,B");
	});
	
	test('when an invalid Sense is given for MonsterSenses', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
				"Name": "Test",
				"Senses": {
					"C": 3
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Sense Name\" must be one of A sense,B sense");
	});

	test('when a valid Skill is given for MonsterSkills but the Bonus field is invalid', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 2,
				"Name": "Test",
				"Skills": {
					"A": "testing"
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Skill Bonus\" must be a number");
	});

	test('when a valid Sense is given for MonsterSenses but the Bonus field is invalid', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
				"Name": "Test",
				"Senses": {
					"A sense": "testing"
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Sense Bonus\" must be a number");
	});

	test('when a valid Skill is given for MonsterSkills', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
				"Name": "Test",
				"Skills": {
					"A": 3,
					"B": 10
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("success");
	});

	test('when a valid Sense is given for MonsterSenses', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
				"Name": "Test",
				"Senses": {
					"A sense": 3,
					"B sense": 10
				}
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("success");
	});
	
	test('when a valid Skill is given for MonsterSkills but Skills is an array', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
				"Name": "Test",
				"Skills": [{
					"A": 3
				}]
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Skills\" must be an object");
	});

	test('when a valid Sense is given for MonsterSenses but Senses is an array', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
				"Name": "Test",
				"Senses": [{
					"A sense": 3
				}]
			},
		});

		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Senses\" must be an object");
	});

	test('when an invalid Strength is given for AbilityScores', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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

	test('when Actions is an object', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
				"Name": "Test",
				"Actions": {
					"0": {
						"Name": "Test",
						"Description": "Something"
				    }
				}
			},
		});
		
		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Actions\" must be an array");
	});

	test('when Actions is an array containing arrays', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
				"Name": "Test",
				"Actions": [
					[
						"Name", "Test",
						"Description", "Something"
					]
				]
			},
		});
		
		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("\"Action Items\" must be an object");
	});

	test('when name is not provided for an action', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		expect(response['messages'][0]).toBe("\"Name\" is required");
	});

	test('when name is not provided for an action', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		expect(response['messages'][0]).toBe("\"Description\" is required");
	});

	test('when invalid HitBonus is provided for an action', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		expect(response['messages'][0]).toBe("\"HitBonus\" must be a number");
	});

	test('when invalid DamageBonus is provided for an action', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		expect(response['messages'][0]).toBe("\"DamageBonus\" must be a number");
	});

	test('when invalid Type is provided for an action', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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
		expect(response['messages'][0]).toBe("\"Type\" must be one of SpecialAbility,Action,LegendaryAction");
	});

	test('when proper payload is provided for an action', async () => {
		const response = await monster.Edit({
			payload: {
				"Id": 0,
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

describe('monster get one tests', async () => {
	beforeAll( async () => {
		Monster.clear();

		const monster = new Monster();
		monster.Name = "John Doe";
		monster.Id = 1;
		const skill = new MonsterSkill();
		skill.Monster = monster;
		skill.Skill = new Skill();
		skill.Skill.Name = 'C Skill';
		skill.Bonus = 10;
		monster.Skills.push(skill)
		const sense = new MonsterSense();
		sense.Monster = monster;
		sense.Sense = new Sense();
		sense.Sense.Name = 'C Sense';
		sense.Bonus = 10;
		monster.Senses.push(sense)
		await monster.save();

		const monster2 = new Monster();
		monster2.Name = "John Doe";
		monster2.Id = 2;
		await monster2.save();

		const monster3 = new Monster();
		monster3.Name = "John Doe";
		monster3.Id = 3;
		await monster3.save();
	});

	var monster = new MonsterFactory();


	test('when monster Id is given properly first monster', async () => {
		const response = await monster.GetOne({
			params: {
				monsterId: 1
			},
		});
		
		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(0);
		expect(response['content'].Skills).toEqual({
			"C Skill": 10
		});
		expect(response['content'].Senses).toEqual({
			"C Sense": 10
		});
	});

	test('when monster Id is given properly last monster', async () => {
		const response = await monster.GetOne({
			params: {
				monsterId: 3
			},
		});
		
		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(0);
		expect(response['content'].Skills).toEqual({});
		expect(response['content'].Skills).toEqual({});
	});

	test('when monster Id is given properly but no monster', async () => {
		const response = await monster.GetOne({
			params: {
				monsterId: 4
			},
		});
		
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe('Monster not found.');
		expect(response['content']).toEqual({});
	});

	test('when monster Id parameter is not number', async () => {
		const response = await monster.GetOne({
			params: {
				monsterId: 'test'
			},
		});
		
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("Parameter 'monsterId' must be a number.");
	});

});

describe('monster delete tests', async () => {
	beforeAll( async () => {
		Monster.clear();

		const monster = new Monster();
		monster.Name = "John Doe";
		monster.Id = 1;
		await monster.save();

		const monster2 = new Monster();
		monster2.Name = "John Doe";
		monster2.Id = 2;
		await monster2.save();

		const monster3 = new Monster();
		monster3.Name = "John Doe";
		monster3.Id = 3;
		await monster3.save();
	});

	var monster = new MonsterFactory();


	test('when monster Id is given properly first monster', async () => {
		const response = await monster.Delete({
			params: {
				monsterId: 1
			},
		});
		
		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe('success');
		expect((await Monster.find({ Id: 1 }))).toEqual([]);
	});

	test('when monster Id is given properly last monster', async () => {
		const response = await monster.Delete({
			params: {
				monsterId: 3
			},
		});
		
		expect(response['status']).toBe(201);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe('success');
		expect((await Monster.find({ Id: 3 }))).toEqual([]);
	});

	test('when monster Id is given properly but no monster', async () => {
		const response = await monster.Delete({
			params: {
				monsterId: 4
			},
		});
		
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe('Monster not found.');
	});

	test('when monster Id parameter is not number', async () => {
		const response = await monster.Delete({
			params: {
				monsterId: 'test'
			},
		});
		
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("Parameter 'monsterId' must be a number.");
	});

});

describe('monster get all tests', async () => {
	beforeAll( async () => {
		Monster.clear();
		const monster = new Monster();

		monster.Name = "John Doe";
		monster.Id = 1;
		await monster.save();

		const monster2 = new Monster();
		monster2.Name = "John Doe";
		monster2.Id = 2;
		await monster2.save();

		const monster3 = new Monster();
		monster3.Name = "John Doe";
		monster3.Id = 3;
		await monster3.save();
	});

	var monster = new MonsterFactory();


	test('when page number and page size is given properly for first page', async () => {
		const response = await monster.GetMany({
			params: {
				page: 0,
				size: 2
			},
		});
		
		expect.assertions(6);
		expect(response['status']).toBe(201);
		expect(response['total']).toBe(3);
		expect(response['messages'].length).toBe(0);
		expect(response['content'].length).toBe(2);
		expect(response['content'][0].Id).toBe(1);
		expect(response['content'][1].Id).toBe(2);
	});

	test('when page number and page size is given properly for last page', async () => {
		const response = await monster.GetMany({
			params: {
				page: 1,
				size: 2
			},
		});
		
		expect.assertions(5);
		expect(response['status']).toBe(201);
		expect(response['total']).toBe(3);
		expect(response['messages'].length).toBe(0);
		expect(response['content'].length).toBe(1);
		expect(response['content'][0].Id).toBe(3);
	});

	test('when page parameter is not number', async () => {
		const response = await monster.GetMany({
			params: {
				page: "test",
				size: 2
			},
		});
		
		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("Parameter 'page' must be a number.");
	});

	test('when size parameter is not number', async () => {
		const response = await monster.GetMany({
			params: {
				page: 0,
				size: "test"
			},
		});
		
		expect.assertions(3);
		expect(response['status']).toBe(400);
		expect(response['messages'].length).toBe(1);
		expect(response['messages'][0]).toBe("Parameter 'size' must be a number.");
	});

});

/*

Monster paginated get tests

When a page number if provided return all monsters in that page

*/
