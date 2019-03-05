import {MonsterFactory} from "./monster";

jest.mock("./entity/AbilityScore");
jest.mock("./entity/Monster");
jest.mock("./entity/MonsterAbilityScore");
jest.mock("./entity/MonsterSavingThrow");
jest.mock("./entity/MonsterSkill");
jest.mock("./entity/Skill");

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
				"Damage": "2d8",
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
				"Skills": {
					"A": 10,
					"B": null
				}
			},
		});

		expect.assertions(2);

		expect(response['status']).toBe(201);
		expect(response['message']).toBe("success");
	});

	test('when only name is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
			},
		});

		expect.assertions(2);

		expect(response['status']).toBe(201);
		expect(response['message']).toBe("success");
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
		// console.log(response)
		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Name must be provided.");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
	});


	test('when an invalid monster size is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "test",
				"Languages": "test languages",
				"Senses": "test senses",
				"HitPoints": 13,
				"DamageVulnerabilities": "test",
				"DamageResistances": "test",
				"DamageImmunities": "test",
				"ConditionImmunities": "test",
				"Size": "InvalidSize",
				"Type": "Fiend"
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Monster size is not valid.");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
	});

	test('when an invalid monster type is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "test",
				"Languages": "test languages",
				"Senses": "test senses",
				"HitPoints": 13,
				"DamageVulnerabilities": "test",
				"DamageResistances": "test",
				"DamageImmunities": "test",
				"ConditionImmunities": "test",
				"Type": "InvalidType"
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Monster type is not valid.");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
	});

	test('when an invalid monster race is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "test",
				"Languages": "test languages",
				"Senses": "test senses",
				"HitPoints": 13,
				"DamageVulnerabilities": "test",
				"DamageResistances": "test",
				"DamageImmunities": "test",
				"ConditionImmunities": "test",
				"Race": "InvalidRace"
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Monster race is not valid.");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
	});

	test('when an invalid monster alignment is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "test",
				"Languages": "test languages",
				"Senses": "test senses",
				"HitPoints": 13,
				"DamageVulnerabilities": "test",
				"DamageResistances": "test",
				"DamageImmunities": "test",
				"ConditionImmunities": "test",
				"Alignment": "InvalidAlignment"
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Monster alignment is not valid.");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
	});

	test('when an invalid monster environment is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "test",
				"Languages": "test languages",
				"Senses": "test senses",
				"HitPoints": 13,
				"DamageVulnerabilities": "test",
				"DamageResistances": "test",
				"DamageImmunities": "test",
				"ConditionImmunities": "test",
				"Environment": "InvalidEnvironment"
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Monster environment is not valid.");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
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

		expect.assertions(2);

		expect(response['status']).toBe(201);
		expect(response['message']).toBe("success");
		
	});

	test('when an invalid Skill is given for MonsterSkills', async () => {
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
				"AbilityScores": {
				},
				"SavingThrows": {
				},
				"Skills": {
					"C": 3
				}
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Skill is invalid: C");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
		
	});

	test('when a valid Skill is given for MonsterSkills but the Bonus field is invalid', async () => {
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
				"AbilityScores": {
				},
				"SavingThrows": {
				},
				"Skills": {
					"A": "testing"
				}
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("MonsterSkill value has to be either null or a number.");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
		
	});

	test('when an invalid Strength is given for AbilityScores', async () => {
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
				"AbilityScores": {
					"Strength": "test"
				}
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Strength value for AbilityScores is not valid: test");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
		
	});

	test('when an invalid Dexterity is given for AbilityScores', async () => {
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
				"AbilityScores": {
					"Dexterity": "test"
				}
			},
		});
		
		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Dexterity value for AbilityScores is not valid: test");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
		
	});

	test('when an invalid Constitution is given for AbilityScores', async () => {
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
				"AbilityScores": {
					"Constitution": "test"
				}
			},
		});
		
		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Constitution value for AbilityScores is not valid: test");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
		
	});

	test('when an invalid Intelligence is given for AbilityScores', async () => {
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
				"AbilityScores": {
					"Intelligence": "test"
				}
			},
		});
		
		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Intelligence value for AbilityScores is not valid: test");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
		
	});

	test('when an invalid Wisdom is given for AbilityScores', async () => {
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
				"AbilityScores": {
					"Wisdom": "test"
				}
			},
		});
		
		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Wisdom value for AbilityScores is not valid: test");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
		
	});

	test('when an invalid Wisdom is given for AbilityScores', async () => {
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
				"AbilityScores": {
					"Charisma": "test"
				}
			},
		});
		
		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Charisma value for AbilityScores is not valid: test");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
		
	});


	test('when an invalid Strength is given for SavingThrows', async () => {
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
				"SavingThrows": {
					"Strength": "test"
				}
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Strength value for SavingThrows is not valid: test");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
		
	});

	test('when an invalid Dexterity is given for SavingThrows', async () => {
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
				"SavingThrows": {
					"Dexterity": "test"
				}
			},
		});
		
		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Dexterity value for SavingThrows is not valid: test");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
		
	});

	test('when an invalid Constitution is given for SavingThrows', async () => {
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
				"SavingThrows": {
					"Constitution": "test"
				}
			},
		});
		
		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Constitution value for SavingThrows is not valid: test");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
		
	});

	test('when an invalid Intelligence is given for SavingThrows', async () => {
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
				"SavingThrows": {
					"Intelligence": "test"
				}
			},
		});
		
		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Intelligence value for SavingThrows is not valid: test");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
		
	});

	test('when an invalid Wisdom is given for SavingThrows', async () => {
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
				"SavingThrows": {
					"Wisdom": "test"
				}
			},
		});
		
		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Wisdom value for SavingThrows is not valid: test");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
		
	});

	test('when an invalid Charisma is given for SavingThrows', async () => {
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
				"SavingThrows": {
					"Charisma": "test"
				}
			},
		});
		
		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Charisma value for SavingThrows is not valid: test");
		} else {
			expect.assertions(1);
			expect(response['status']).toBe(400);
		}
		
	});

});
