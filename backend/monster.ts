import Joi, { ValidationError, ValidationErrorItem } from 'joi';
import { Monster } from "./entity/Monster";
import { Size, MonsterType, MonsterRace, Alignment, Environment, MonsterAction } from "./entity/MonsterEnums";
import { Skill } from "./entity/Skill"
import { MonsterAbilityScore } from "./entity/MonsterAbilityScore";
import { MonsterSavingThrow } from "./entity/MonsterSavingThrow";
import { MonsterSkill } from "./entity/MonsterSkill";
import { Action } from "./entity/Action";
import { Sense } from "./entity/Sense";
import { MonsterSense } from './entity/MonsterSense';

/*
Parameters:
 - username or email
 - password
Sample curl request,
 curl --header "Content-Type: application/json" \
 --request POST \
 --data '
 {
	"Name": "Test",
	"Size": "Tiny", // default Medium
	"Type": "Fiend", // default Beast
	"Race": "Human", // default AnyRace
	"Alignment": "AnyAlignment", // default Unaligned
	"ArmorClass": 5, // default 12
	"HitPoints": 13, // default 12
	"Damage": "5d12", // default "2d8"
	"Speed": "20 ft.", // default "30 ft."
	"Senses": "test sense",
	"Languages": "test languages",
	"DamageVulnerabilities": "test",
	"DamageResistances": "test",
	"DamageImmunities": "test",
	"ConditionImmunities": "test",
	"ChallengeRating": 3, // default 1
	"AbilityScores": { 
		// all properties should either be a number or not provided
		"Strength": 5, // default 1
		"Dexterity": 5, // default 1
		"Constitution": 5, // default 1
		"Intelligence": 5, // default 1
		"Wisdom": 5, // default 1
		"Charisma": 5, // default 1
	},
	"SavingThrows": {
		// all properties should either be a number or not provided
		"Strength": 5, // default 1
		"Dexterity": 5, // default 1
		"Constitution": 5, // default 1
		"Intelligence": 5, // default 1
		"Wisdom": 5, // default 1
		"Charisma": 5, // default 1
	},
	"Skills": {
		// key, value pairs
		// key is the name of the Skill
		// value is the Bonus field, default is 0 so null can be given
		"A": 10,
		"B": null,
		"C": 3
	},
}' \
 http://localhost:3000/monster/create
 */
export class MonsterFactory {
	private skillNameSchema = Joi.object({
		Skills: Joi.object().pattern(
			Joi.symbol().valid(Joi.ref('$SkillOptions')),
			Joi.number().integer().greater(0).allow(0).label('Skill Bonus')
		).default({})
	});
	private senseNameSchema = Joi.object({
		Skills: Joi.object().pattern(
			Joi.symbol().valid(Joi.ref('$SenseOptions')),
			Joi.number().integer().greater(0).allow(0).label('Sense Bonus')
		).default({})
	});
	/*private speedNameSchema = Joi.object({
		Skills: Joi.object().pattern(
			Joi.symbol().valid(Joi.ref('$SpeedOptions')),
			Joi.number().integer().greater(0).allow(0).label('Speed Bonus')
		).default({})
	});*/
	private payloadSchema = Joi.object({
		Name: Joi.string().required().max(50).label('Name'),
		Size: Joi.string().valid(Joi.ref('$SizeOptions')),
		Type: Joi.string().valid(Joi.ref('$TypeOptions')),
		Race: Joi.string().valid(Joi.ref('$RaceOptions')),
		Alignment: Joi.string().valid(Joi.ref('$AlignmentOptions')),
		Environment: Joi.string().valid(Joi.ref('$EnvironmentOptions')),
		ArmorClass: Joi.number().integer().greater(0).label('ArmorClass'),
		HitPoints: Joi.number().integer().greater(0).label('HitPoints'),
		// (rolls 'd' dice [+ - * /] operation) one or more times then rolls 'd' dice
		HitPointDistribution: Joi.string().max(20).regex(/^((\d+d\d+)[\+\-\*\/])*(\d+d\d+)([\+\-\*\/]\d+)?$/, '#d# OR (#d# operator (#d# or number)) NO spaces').label('HitPointDistribution'),
		Speed: Joi.string().max(100),
		Languages: Joi.string().max(100).label('Languages'),
		DamageVulnerabilities: Joi.string().allow('').max(200).label('DamageVulnerabilities'),
		DamageResistances: Joi.string().allow('').max(200).label('DamageResistances'),
		DamageImmunities: Joi.string().allow('').max(200).label('DamageImmunities'),
		ConditionImmunities: Joi.string().allow('').max(200).label('ConditionImmunities'),
		ChallengeRating: Joi.number().greater(0).label('ChallengeRating'),
		AbilityScores: Joi.object({
			Strength: Joi.number().integer().greater(0).label('Strength'),
			Dexterity: Joi.number().integer().greater(0).label('Dexterity'),
			Constitution: Joi.number().integer().greater(0).label('Constitution'),
			Intelligence: Joi.number().integer().greater(0).label('Intelligence'),
			Wisdom: Joi.number().integer().greater(0).label('Wisdom'),
			Charisma: Joi.number().integer().greater(0).label('Charisma')
		}).default({}),
		SavingThrows: Joi.object({
			Strength: Joi.number().integer().label('Strength'),
			Dexterity: Joi.number().integer().label('Dexterity'),
			Constitution: Joi.number().integer().label('Constitution'),
			Intelligence: Joi.number().integer().label('Intelligence'),
			Wisdom: Joi.number().integer().label('Wisdom'),
			Charisma: Joi.number().integer().label('Charisma')
		}).default({}),
		/* This is the correct way to do this,
			waiting for responce on github.
			https://github.com/hapijs/joi/issues/1748
		Skills: Joi.object().pattern(
			Joi.symbol().valid(Joi.ref('$SkillOptions')),
			Joi.number().integer().greater(0).allow(0).label('Skill Bonus')
		).default({})*/
		/* This is how to send skills as an array of objects.
		Skills: Joi.array().items(Joi.object({
			Name: Joi.string().required().valid(Joi.ref('$SkillOptions')).label('Skill Name'),
			Bonus: Joi.number().integer().greater(0).allow(0).required().label('Skill Bonus')
		})).default([]),*/
		/*Senses: Joi.object().pattern(
			Joi.symbol().valid(Joi.ref('$SenseOptions')),
			Joi.number().integer().greater(0).allow(0).label('Sense Bonus')
		).default({}),*/
		Actions: Joi.array().items(Joi.object({
			Name: Joi.string().required().max(50),
			Description: Joi.string().required().max(250),
			HitBonus: Joi.number().integer().greater(0).allow(0),
			Damage: Joi.string().max(20).regex(/^(\ *(\d+d\d+)\ *[\+\-\*\/]\ *)*(\ *(\d+d\d+))\ *(\+\d+)?$/, 'range'),
			DamageBonus: Joi.number().integer().greater(0).allow(0),
			Type: Joi.string().valid(Joi.ref('$ActionOptions'))
		}).label('Action Items')).default([])
	});
	public async Create(request: {payload:any}) {
		const allSkills: Skill[] = await Skill.find({ select: ["Id", "Name"] });
		const skillNames: string[] = [];
		const skillLookup: { [Name: string]: Skill }= {};
		allSkills.forEach((value) => {
			skillNames.push(value.Name);
			skillLookup[value.Name] = value;
		})
		const allSenses: Sense[] = await Sense.find({ select: ["Id", "Name"] });
		const senseNames: string[] = [];
		const senseLookup: { [Name: string]: Sense }= {};
		allSenses.forEach((value) => {
			senseNames.push(value.Name);
			senseLookup[value.Name] = value;
		})
		const options: Joi.ValidationOptions = {
			abortEarly: false,
			convert: true,
			allowUnknown: false,
			context: {
				SizeOptions: Object.keys(Size),
				TypeOptions: Object.keys(MonsterType),
				RaceOptions: Object.keys(MonsterRace),
				AlignmentOptions: Object.keys(Alignment),
				EnvironmentOptions: Object.keys(Environment),
				ActionOptions: Object.keys(MonsterAction),
				SkillOptions: skillNames,
				SenseOptions: senseNames
			}
		}
		// Temp fix waiting for GitHub responce 
		// https://github.com/hapijs/joi/issues/1748
		// This fix recompiles the schema every time a monster is created
		//  this will impact performance by some amount, unknown.
		let skillMessage = skillNames.join(',');
		this.skillNameSchema = Joi.object({
			Skills: Joi.object().pattern(
				Joi.string().valid(skillNames),
				Joi.number().integer().greater(0).allow(0).label('Skill Bonus')
			).error((errors) => {
				for (let error of errors){
					if(error.type == 'object.allowUnknown' || error.type == 'any.allowOnly')
						error.message = "\"Skill Name\" must be one of " + skillMessage
				}
				return errors
			}).default({})
		});
		let senseMessage = senseNames.join(',');
		this.senseNameSchema = Joi.object({
			Senses: Joi.object().pattern(
				Joi.string().valid(senseNames),
				Joi.number().integer().greater(0).allow(0).label('Sense Bonus')
			).error((errors) => {
				for (let error of errors){
					if(error.type == 'object.allowUnknown' || error.type == 'any.allowOnly')
						error.message = "\"Sense Name\" must be one of " + senseMessage
				}
				return errors
			}).default({})
		});
		return await Joi.validate(
			request.payload,
			this.payloadSchema.concat(this.skillNameSchema.concat(this.senseNameSchema)),
			options,
			async (errors: ValidationError, value: any) => {
				if(errors){
					const messages: Set<string> = new Set<string>();
					errors.details.forEach((error: ValidationErrorItem) => {
						let message: string = ''
						if ((error.type == 'any.allowOnly') && error.context && options) {
							for (let valid of error.context.valids){
								if (Joi.isRef(valid)){
									const reference = valid as Joi.Reference
									message += reference(null, options) + ',';
								} /* add this else back in if we ever have .valid([something]) instead of references.
								else {
									message += valid + ','
								}*/
							}
						}
						message = error.message.split('[')[0] + message.substr(0,message.length-1);
						messages.add(message);
					})
					return {
						"status": 400,
						"messages": Array.from(messages.values())
					};
				}else{
					const monster: Monster = Object.assign(new Monster(), value);
					// save ability score
					const abilityScore: MonsterAbilityScore = Object.assign(new MonsterAbilityScore(), monster.AbilityScores);
					monster.Senses = [];
					monster.Skills = [];
					monster.Actions = [];
					monster.Encounters = [];

					abilityScore.Monster = monster;
					monster.AbilityScores = abilityScore;
					await abilityScore.save();
					// save saving throws
					const savingThrow: MonsterSavingThrow = Object.assign(new MonsterSavingThrow(), monster.SavingThrows);
					savingThrow.Monster = monster;
					monster.SavingThrows = savingThrow;
					await savingThrow.save();
					// save monster
					await monster.save();
					// link skills to monster
					monster.Skills = [];
					for (let skillName in value.Skills) {
						const monsterSkill: MonsterSkill = new MonsterSkill();
						monsterSkill.Bonus = value.Skills[skillName];
						monsterSkill.Skill = skillLookup[skillName];
						monsterSkill.Monster = monster;
						monster.Skills.push(monsterSkill);
					}
					// save skills
					await MonsterSkill.save(monster.Skills);
					// link senses to monster
					monster.Senses = [];
					for (let senseName in value.Senses) {
						const monsterSense: MonsterSense = new MonsterSense();
						monsterSense.Bonus = value.Senses[senseName];
						monsterSense.Sense = senseLookup[senseName];
						monsterSense.Monster = monster;
						monster.Senses.push(monsterSense);
					}
					// save senses
					await MonsterSense.save(monster.Senses);
					// link actions to monster
					monster.Actions = [];
					for (let index in value.Actions) {
						const action: Action = Object.assign(new Action(),value.Actions[index]);
						action.Monster = monster;
						monster.Actions.push(action);
					}
					// save actions
					await Action.save(monster.Actions);
					return {
						"status": 201,
						"messages": ["success"]
					};
				}
			}
		);
	}

	public async GetAll(request: any) {
		var pageNumber = +request.params.page;
		var pageSize = +request.params.size;
		
		var messages = [];

		if (isNaN(pageNumber)) {
			messages.push("Parameter 'page' must be a number.")
		}

		if (isNaN(pageSize)) {
			messages.push("Parameter 'size' must be a number.")
		}

		if (messages.length == 0) {

			var allMonsters = await Monster.find();

			var respond = allMonsters.slice(pageSize*pageNumber, pageSize*(pageNumber+1))

			return {
				"status": 201,
				"messages": messages,
				"content": respond,
				"total": allMonsters.length
			}
		} else {
			return {
				"status": 400,
				"messages": messages,
				"content": [],
				"total": 0
			}
		}
	}
}