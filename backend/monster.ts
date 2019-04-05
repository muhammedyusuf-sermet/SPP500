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
		Id: Joi.number().label('Id'),
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
		}),
		SavingThrows: Joi.object({
			Strength: Joi.number().integer().label('Strength'),
			Dexterity: Joi.number().integer().label('Dexterity'),
			Constitution: Joi.number().integer().label('Constitution'),
			Intelligence: Joi.number().integer().label('Intelligence'),
			Wisdom: Joi.number().integer().label('Wisdom'),
			Charisma: Joi.number().integer().label('Charisma')
		}),
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
			Damage: Joi.string().max(20).regex(/^((\d+d\d+)[\+\-\*\/])*(\d+d\d+)([\+\-\*\/]\d+)?$/, '#d# OR (#d# operator (#d# or number)) NO spaces'),
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

	public async Edit(request: {payload:any}) {
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
			})
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
			})
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
					var monsterId = +request.payload.Id;
					let monsterFind: Monster[] = await Monster.find({
						relations: ['AbilityScores', 'SavingThrows', 'Skills', 'Senses', 'Skills.Skill', 'Senses.Sense', 'Skills.Monster', 'Senses.Monster'],
						where: { Id: monsterId }
					});
					if(monsterFind.length > 0){
						let monsterDb: Monster = monsterFind[0];
						let keep: Set<string>;
						// link normal attributes
						monsterDb.Name = value.Name;
    					monsterDb.Size = value.Size;
    					monsterDb.Type = value.Type;
    					monsterDb.Race = value.Race;
    					monsterDb.Environment = value.Environment;
    					monsterDb.Alignment = value.Alignment;

    					monsterDb.ArmorClass = value.ArmorClass;
    					monsterDb.HitPoints = value.HitPoints;
    					monsterDb.HitPointDistribution = value.HitPointDistribution;

    					monsterDb.Speed = value.Speed;
    					monsterDb.Languages = value.Languages;

    					monsterDb.DamageVulnerabilities = value.DamageVulnerabilities;
    					monsterDb.DamageResistances = value.DamageResistances;
    					monsterDb.DamageImmunities = value.DamageImmunities;
    					monsterDb.ConditionImmunities = value.ConditionImmunities;

						monsterDb.ChallengeRating = value.ChallengeRating;
						
						// link ability score
						if(value.AbilityScores){
							monsterDb.AbilityScores.Strength = value.AbilityScores.Strength
							monsterDb.AbilityScores.Dexterity = value.AbilityScores.Dexterity
							monsterDb.AbilityScores.Charisma = value.AbilityScores.Charisma
							monsterDb.AbilityScores.Constitution = value.AbilityScores.Constitution
							monsterDb.AbilityScores.Intelligence = value.AbilityScores.Intelligence
							monsterDb.AbilityScores.Wisdom = value.AbilityScores.Wisdom
							await monsterDb.AbilityScores.save();
						}
						// link saving throw
						if(value.SavingThrows) {
							monsterDb.SavingThrows.Strength = value.SavingThrows.Strength
							monsterDb.SavingThrows.Charisma = value.SavingThrows.Charisma
							monsterDb.SavingThrows.Constitution = value.SavingThrows.Constitution
							monsterDb.SavingThrows.Dexterity = value.SavingThrows.Dexterity
							monsterDb.SavingThrows.Intelligence = value.SavingThrows.Intelligence
							monsterDb.SavingThrows.Wisdom = value.SavingThrows.Wisdom
							await monsterDb.SavingThrows.save();
						}

						// link skills to monster
						if(value.Skills){
							for (const [skillName, bonus] of Object.entries<number>(value.Skills)) {
								let missing = true;
								for (let index in monsterDb.Skills) {
									if (monsterDb.Skills[index].Skill.Name == skillName) {
										monsterDb.Skills[index].Bonus = bonus;
										missing = false;
										break;
									}
								}
								if (missing) {
									const monsterSkill: MonsterSkill = new MonsterSkill();
									monsterSkill.Bonus = bonus
									monsterSkill.Skill = skillLookup[skillName];
									monsterSkill.Monster = monsterDb;
									monsterDb.Skills.push(monsterSkill);
								}
							}
							keep = new Set(Object.keys(value.Skills));
							const remove = monsterDb.Skills.filter((skill) => keep.has(skill.Skill.Name) == false)
							const save = monsterDb.Skills.filter((skill) => keep.has(skill.Skill.Name))
							await MonsterSkill.remove(remove);
							await MonsterSkill.save(save);
						}

						// link senses to monster
						if(value.Senses){
							for (const [senseName, bonus] of Object.entries<number>(value.Senses)) {
								let missing = true;
								for (let index in monsterDb.Senses) {
									if (monsterDb.Senses[index].Sense.Name == senseName) {
										monsterDb.Senses[index].Bonus = bonus;
										missing = false;
										break;
									}
								}
								if (missing) {
									const monsterSense: MonsterSense = new MonsterSense();
									monsterSense.Bonus = bonus
									monsterSense.Sense = senseLookup[senseName];
									monsterSense.Monster = monsterDb;
									monsterDb.Senses.push(monsterSense);
								}
							}
							keep = new Set(Object.keys(value.Senses));
							const remove = monsterDb.Senses.filter((sense) => keep.has(sense.Sense.Name) == false)
							const save = monsterDb.Senses.filter((sense) => keep.has(sense.Sense.Name))
							await MonsterSense.remove(remove);
							await MonsterSense.save(save);
						}

						// link actions to monster
						/*for (let index in value.Actions) {
							let missing = true;
							for (let action of monsterDb.Actions) {
								if (action.Name == value.Actions[index].Name) {
									Object.assign(action, value.Actions[index]);
									missing = false;
									break;
								}
							}
							if (missing) {
								const action: Action = Object.assign(new Action(),value.Actions[index]);
								action.Monster = monsterDb;
								monsterDb.Actions.push(action);
							}
						}
						await Action.save(monsterDb.Actions);*/

						await monsterDb.save();
						return {
							"status": 201,
							"messages": ["success"]
						};
					} else {
						return {
							"status": 400,
							"messages": ['Monster not found.']
						}
					}
				}
			}
		);
	}

	public async Delete(request: any){
		const monsterId = +request.params.monsterId;
		const messages: string[] = [];
		
		if (isNaN(monsterId)) {
			messages.push("Parameter 'monsterId' must be a number.")
		}

		if (messages.length == 0) {
			let monster: Monster[] | undefined = await Monster.find({
				relations: ['AbilityScores', 'SavingThrows', 'Skills', 'Senses', 'Skills.Skill', 'Skills.Monster', 'Senses.Sense', 'Senses.Monster', 'Actions', 'Encounters'], 
				where: { Id: monsterId }
			});
			if (monster && monster.length > 0) {
				const monsterDb: Monster = monster[0];
				await MonsterSkill.remove(monsterDb.Skills)
				await MonsterSense.remove(monsterDb.Senses)
				await Action.remove(monsterDb.Actions)

				await monsterDb.remove()

				return {
					"status": 201,
					"messages": ['success'],
				}
			} else {
				return {
					"status": 400,
					"messages": ['Monster not found.'],
				}
			}
		} else {
			return {
				"status": 400,
				"messages": messages,
			}
		}
	}

	public async GetOne(request: any) {
		var monsterId = +request.params.monsterId;
		
		var messages: string[] = [];

		if (isNaN(monsterId)) {
			messages.push("Parameter 'monsterId' must be a number.")
		}

		if (messages.length == 0) {
			let monster: Monster[] | undefined = await Monster.find({
				relations: ['AbilityScores', 'SavingThrows', 'Skills', 'Senses', 'Skills.Skill', 'Senses.Sense'], 
				where: { Id: monsterId }
			});
			if (monster && monster.length > 0) {
				const firstMonster: Monster = monster[0];
				let newMonster: any = Object.assign({}, firstMonster)
				newMonster.Skills = {}
				for(let skill of firstMonster.Skills){
					newMonster.Skills[skill.Skill.Name] = skill.Bonus
				}
				newMonster.Senses = {}
				for(let sense of firstMonster.Senses){
					newMonster.Senses[sense.Sense.Name] = sense.Bonus
				}
				newMonster.AbilityScores.Id = undefined
				newMonster.SavingThrows.Id = undefined
			
				return {
					"status": 201,
					"messages": messages,
					"content": newMonster,
				}
			} else {
				return {
					"status": 400,
					"messages": ['Monster not found.'],
					"content": {},
				}
			}
		} else {
			return {
				"status": 400,
				"messages": messages,
				"content": {},
			}
		}
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