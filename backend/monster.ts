import {Monster} from "./entity/Monster";
import { Size, MonsterType, MonsterRace, Alignment, Environment } from "./entity/MonsterEnums";
import {Skill} from "./entity/Skill"
import {MonsterAbilityScore} from "./entity/MonsterAbilityScore";
import {MonsterSavingThrow} from "./entity/MonsterSavingThrow";
import {MonsterSkill} from "./entity/MonsterSkill";

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
import Joi, { ValidationError } from 'joi';

export class MonsterFactory {
	private payloadSchema = Joi.object({
		Name: Joi.string().required().max(50),
		Size: Joi.string().valid(Joi.ref('$SizeOptions')),
		Type: Joi.string().valid(Joi.ref('$TypeOptions')),
		Race: Joi.string().valid(Joi.ref('$RaceOptions')),
		Alignment: Joi.string().valid(Joi.ref('$AlignmentOptions')),
		Environment: Joi.string().valid(Joi.ref('$EnvironmentOptions')),
		ArmorClass: Joi.number().integer().greater(0),
		HitPoints: Joi.number().integer().greater(0),
		// (rolls 'd' dice [+ - * /] operation) one or more times then rolls 'd' dice
		HitPointDistribution: Joi.string().max(20).regex(/^(\ *(\d+d\d+)\ *[\+\-\*\/]\ *)*(\ *(\d+d\d+))\ *(\+\d+)?$/, 'distribution'),
		Speed: Joi.string().max(100),
		Senses: Joi.string().max(100),
		Languages: Joi.string().max(100),
		DamageVulnerabilities: Joi.string().allow('').max(200),
		DamageResistances: Joi.string().allow('').max(200),
		DamageImmunities: Joi.string().allow('').max(200),
		ConditionImmunities: Joi.string().allow('').max(200),
		ChallengeRating: Joi.number().greater(0),
		ExperiencePoints: Joi.number().greater(0),
		AbilityScores: Joi.object({
			Strength: Joi.number().integer().greater(0),
    		Dexterity: Joi.number().integer().greater(0),
    		Constitution: Joi.number().integer().greater(0),
    		Intelligence: Joi.number().integer().greater(0),
    		Wisdom: Joi.number().integer().greater(0),
    		Charisma: Joi.number().integer().greater(0)
		}).default({}),
		SavingThrows: Joi.object({
			Strength: Joi.number().integer(),
    		Dexterity: Joi.number().integer(),
    		Constitution: Joi.number().integer(),
    		Intelligence: Joi.number().integer(),
    		Wisdom: Joi.number().integer(),
    		Charisma: Joi.number().integer()
		}).default({}),
		Skills: Joi.array().items(Joi.object({
			Name: Joi.string().valid(Joi.ref('$SkillOptions')).required(),
			Bonus: Joi.number().integer().greater(0).allow(0).required()
		})).default([])
	});
	public async Create(request: {payload:any}) {
		const allSkills: Skill[] = await Skill.find({ select: ["Id", "Name"] });
		const skillNames: string[] = [];
		const skillLookup: { [Name: string]: Skill }= {};
		allSkills.forEach((value) => {
			skillNames.push(value.Name);
			skillLookup[value.Name] = value;
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
				SkillOptions: skillNames
			}
		}
		return await Joi.validate(
			request.payload, 
			this.payloadSchema,
			options,
			async (errors: ValidationError, value: any) => {
				if(errors){
					const messages: string[] = [];
					errors.details.forEach(error => {
						let validOptionsArray: string[][] = []
						if(error.context){
							if(error.context.valids){
								for(let valid of error.context.valids){
									let validOptions: any = options.context;
									for(let key of valid.path){
										validOptions = validOptions[key];
									}
									validOptionsArray.push(validOptions);
								}
							}
						}
						console.log(validOptionsArray);
						error.message = error.message.split('[')[0];
						validOptionsArray.forEach(optionsArray => {
							error.message += optionsArray.toString()+',';
						});
						messages.push(error.message)
					})
					return {
						"status": 400,
						"messages": messages
					};
				}else{
					const monster: Monster = Object.assign(new Monster(), value);
					// save ability score
					const abilityScore: MonsterAbilityScore = Object.assign(new MonsterAbilityScore(), monster.AbilityScores);
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
					for (let index in value.Skills){
						const monsterSkill: MonsterSkill = new MonsterSkill();
						monsterSkill.Bonus = value.Skills[index].Bonus;
						monsterSkill.Skill = skillLookup[value.Skills[index].Name];
						monsterSkill.Monster = monster;
						monster.Skills.push(monsterSkill);
					}
					// save skills
					MonsterSkill.save(monster.Skills);
					return {
						"status": 201,
						"message": "success"
					};
				}
			}
		);
	}
}