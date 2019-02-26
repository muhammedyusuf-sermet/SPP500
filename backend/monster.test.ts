// import {Monster} from "./entity/Monster";
// import {AbilityScore} from "./entity/AbilityScore";
import {MonsterClass} from "./monster";
// import {Login} from "./login";


jest.mock("./entity/AbilityScore");
jest.mock("./entity/Condition");
jest.mock("./entity/DamageType");
jest.mock("./entity/Monster");
jest.mock("./entity/MonsterAbilityScore");
jest.mock("./entity/MonsterDamageTypeResistance");
jest.mock("./entity/MonsterSavingThrow");
jest.mock("./entity/MonsterSkill");
jest.mock("./entity/Skill");

describe('monster creation tests', async () => {
	// beforeAll( async () => {
	// 	// const abilityScore = new AbilityScore();
	// 	// console.log(abilityScore)
	// 	var a = AbilityScore.findOne({ Name: "A" })
	// 	// var a = new AbilityScore();
	// 	console.log(a)
	// });

	var monster = new MonsterClass();

	test('when proper data is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Senses": "test sense",
				"Languages": "test languages",
				"HitPoints": 13,
				"Size": "Tiny",
				"Type": "Fiend",
				"Race": "Human",
				"Alignment": "LawfulEvil",
				"ArmorClass": 5,
				"Damage": "2d8",
				"Speed": "20 ft.",
				"ChallengeRating": 1,
				"MonsterAbilityScores": {
					"A": 20,
					"B": 3
				},
				"MonsterSavingThrows": {
					"A": null,
					"B": 3
				},
				"MonsterSkills": {
					"A": 10,
					"B": null
				},
				"MonsterDamageTypeResistances": {
					"A": "Immunit",
					"B": null
				},
				"MonsterConditions": [
					"A"
				]
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
				"Size": "Tiny",
				"Type": "Fiend"
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Name must be provided.");
		}
	});

	test('when senses are not given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "test",
				"Languages": "test languages",
				"HitPoints": 13,
				"Size": "Tiny",
				"Type": "Fiend"
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Senses must be provided.");
		}
	});

	test('when languages are not given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "test",
				"Senses": "test senses",
				"HitPoints": 13,
				"Size": "Tiny",
				"Type": "Fiend"
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Languages must be provided.");
		}
	});

	test('when an invalid monster size is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "test",
				"Languages": "test languages",
				"Senses": "test senses",
				"HitPoints": 13,
				"Size": "InvalidSize",
				"Type": "Fiend"
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Monster size is not valid.");
		}
	});

	test('when an invalid monster type is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "test",
				"Languages": "test languages",
				"Senses": "test senses",
				"HitPoints": 13,
				"Type": "InvalidType"
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Monster type is not valid.");
		}
	});

	test('when an invalid monster race is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "test",
				"Languages": "test languages",
				"Senses": "test senses",
				"HitPoints": 13,
				"Race": "InvalidRace"
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Monster race is not valid.");
		}
	});

	test('when an invalid monster alignment is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "test",
				"Languages": "test languages",
				"Senses": "test senses",
				"HitPoints": 13,
				"Alignment": "InvalidAlignment"
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Monster alignment is not valid.");
		}
	});

	test('when an invalid Skill is given for MonsterSkills', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Senses": "test sense",
				"Languages": "test languages",
				"HitPoints": 13,
				"Size": "Tiny",
				"Type": "Fiend",
				"MonsterAbilityScores": {
				},
				"MonsterSavingThrows": {
				},
				"MonsterSkills": {
					"C": 3
				},
				"MonsterDamageTypeResistances": {
				},
				"MonsterConditions": [
				]
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Skill is invalid: C");
		}
		
	});

	test('when a valid Skill is given for MonsterSkills but the Bonus field is invalid', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Senses": "test sense",
				"Languages": "test languages",
				"HitPoints": 13,
				"Size": "Tiny",
				"Type": "Fiend",
				"MonsterAbilityScores": {
				},
				"MonsterSavingThrows": {
				},
				"MonsterSkills": {
					"A": "testing"
				},
				"MonsterDamageTypeResistances": {
				},
				"MonsterConditions": [
				]
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("MonsterSkill value have to be either null or a number.");
		}
		
	});

	test('when an invalid AbilityScore is given for MonsterSavingThrows', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Senses": "test sense",
				"Languages": "test languages",
				"HitPoints": 13,
				"Size": "Tiny",
				"Type": "Fiend",
				"MonsterAbilityScores": {
				},
				"MonsterSavingThrows": {
					"C": null
				},
				"MonsterSkills": {
				},
				"MonsterDamageTypeResistances": {
				},
				"MonsterConditions": [
				]
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("AbilityScore is invalid: C");
		}
		
	});

	test('when a valid AbilityScore is given for MonsterSavingThrows but the Bonus field is invalid', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Senses": "test sense",
				"Languages": "test languages",
				"HitPoints": 13,
				"Size": "Tiny",
				"Type": "Fiend",
				"MonsterAbilityScores": {
				},
				"MonsterSavingThrows": {
					"A": "testing"
				},
				"MonsterSkills": {
				},
				"MonsterDamageTypeResistances": {
				},
				"MonsterConditions": [
				]
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("MonsterSavingThrow value have to be either null or a number.");
		}
		
	});

	test('when an invalid AbilityScore is given for MonsterAbilityScores', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Senses": "test sense",
				"Languages": "test languages",
				"HitPoints": 13,
				"Size": "Tiny",
				"Type": "Fiend",
				"MonsterAbilityScores": {
					"C": null
				},
				"MonsterSavingThrows": {
				},
				"MonsterSkills": {
				},
				"MonsterDamageTypeResistances": {
				},
				"MonsterConditions": [
				]
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("AbilityScore is invalid: C");
		}
		
	});

	test('when a valid AbilityScore is given for MonsterAbilityScores but the Bonus field is invalid', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Senses": "test sense",
				"Languages": "test languages",
				"HitPoints": 13,
				"Size": "Tiny",
				"Type": "Fiend",
				"MonsterAbilityScores": {
					"A": "testing"
				},
				"MonsterSavingThrows": {
				},
				"MonsterSkills": {
				},
				"MonsterDamageTypeResistances": {
				},
				"MonsterConditions": [
				]
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("MonsterAbilityScore value have to be either null or a number.");
		}
		
	});

	test('when an invalid DamageType is given for MonsterDamageTypeResistances', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Senses": "test sense",
				"Languages": "test languages",
				"HitPoints": 13,
				"Size": "Tiny",
				"Type": "Fiend",
				"MonsterAbilityScores": {
				},
				"MonsterSavingThrows": {
				},
				"MonsterSkills": {
				},
				"MonsterDamageTypeResistances": {
					"C": null
				},
				"MonsterConditions": [
				]
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("DamageType is invalid: C");
		}
		
	});

	test('when a valid DamageType is given for MonsterDamageTypeResistances but the Type field is invalid', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Senses": "test sense",
				"Languages": "test languages",
				"HitPoints": 13,
				"Size": "Tiny",
				"Type": "Fiend",
				"MonsterAbilityScores": {
				},
				"MonsterSavingThrows": {
				},
				"MonsterSkills": {
				},
				"MonsterDamageTypeResistances": {
					"A": "testing"
				},
				"MonsterConditions": [
				]
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("ResistenceType value have to be one of the following: null, Vulnerable, Resistance, Immunit");
		}
		
	});

	test('when an invalid Condition is given', async () => {
		const response = await monster.Create({
			payload: {
				"Name": "Test",
				"Senses": "test sense",
				"Languages": "test languages",
				"HitPoints": 13,
				"Size": "Tiny",
				"Type": "Fiend",
				"MonsterAbilityScores": {
				},
				"MonsterSavingThrows": {
				},
				"MonsterSkills": {
				},
				"MonsterDamageTypeResistances": {
				},
				"MonsterConditions": [
					"C"
				]
			},
		});

		if (response["messages"]){
			expect.assertions(3);
			expect(response['status']).toBe(400);
			expect(response['messages'].length).toBe(1);
			expect(response['messages'][0]).toBe("Condition is invalid: C");
		}
		
	});

});
