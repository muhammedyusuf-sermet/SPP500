import {Size, MonsterType, MonsterRace, Alignment, Monster} from "./entity/Monster";
import {AbilityScore} from "./entity/AbilityScore";
import {Skill} from "./entity/Skill"
import {MonsterAbilityScore} from "./entity/MonsterAbilityScore";
import {MonsterSavingThrow} from "./entity/MonsterSavingThrow";
import {MonsterSkill} from "./entity/MonsterSkill";
import {ResistanceType, MonsterDamageTypeResistance} from "./entity/MonsterDamageTypeResistance"
import {DamageType} from "./entity/DamageType";
import {Condition} from "./entity/Condition";

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
	"Senses": "test sense",
	"Languages": "test languages",
	"HitPoints": 13,
	"Size": "Tiny",
	"Type": "Fiend",
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
		"B": null,
		"C": 3
	},
	"MonsterDamageTypeResistances": {
		"A": "Immunit",
		"B": null
	},
	"MonsterConditions": [
		"A"
	]
}' \
 http://localhost:3000/monster/create
 */
export class MonsterClass {
	public async Create(request: {payload: any}) {
		var data = request.payload;
		const monster = new Monster();
		
		var messages = [];

		// check if fields with no defaults are provided
		// if not raise an error
		// name, senses, languages
		if (!data.Name) {
			messages.push("Name must be provided.");
		}

		monster.Name = data.Name;

		if (!data.Senses) {
			messages.push("Senses must be provided.");
		}

		monster.Senses = data.Senses;

		if (!data.Languages) {
			messages.push("Languages must be provided.");
		}
		
		monster.Languages = data.Languages;

		// check if enum fields are properly provided
		// if not raise an error
		// size, type, race, alignment
		if (Size[data.Size]) {
			monster.Size = data.Size;	
		} else if (data.Size) {
			messages.push("Monster size is not valid.")
		}

		if (MonsterType[data.Type]) {
			monster.Type = data.Type;
		} else if (data.Type) {
			messages.push("Monster type is not valid.")
		}
		
		if (MonsterRace[data.Race]) {
			monster.Race = data.Race;
		} else if (data.Race) {
			messages.push("Monster race is not valid.")
		}

		if (Alignment[data.Alignment]) {
			monster.Alignment = data.Alignment;
		} else if (data.Alignment) {
			messages.push("Monster alignment is not valid.")
		}

		// check if fields with defaults are provided
		// if not do not define them
		var armorClass = Number(data.ArmorClass)
		if (armorClass) {
			monster.ArmorClass = armorClass
		}

		var hitPoints = Number(data.HitPoints)
		if (hitPoints) {
			monster.HitPoints = hitPoints
		}

		if (data.Damage) {
			monster.Damage = data.Damage
		}

		if (data.Speed) {
			monster.Speed = data.Speed
		}

		var challengeRating = Number(data.ChallengeRating)
		if (challengeRating) {
			monster.ChallengeRating = challengeRating
		}
		
		var abilityScoresArray = [];

		// MonsterAbilityScore
		var monsterAbilityScores = data.MonsterAbilityScores
		if (monsterAbilityScores) {
			for (const key in monsterAbilityScores) {
				var abilityScore = await AbilityScore.findOne({ Name: key });

				if (abilityScore) {
					var monsterAbilityScore = new MonsterAbilityScore();
					monsterAbilityScore.Monster = monster;
					monsterAbilityScore.AbilityScore = abilityScore;
					var score = Number(monsterAbilityScores[key]);
					if (score || monsterAbilityScores[key] == null) {
						monsterAbilityScore.Score = score;
						abilityScoresArray.push(monsterAbilityScore);
					} else {
						messages.push("MonsterAbilityScore value have to be either null or a number.")
					}
				} else {
					messages.push("AbilityScore is invalid: " + key);
				}
			}
		}

		var skillsArray = [];
		// MonsterSkill
		var monsterSkills = data.MonsterSkills
		if (monsterSkills) {
			for (const key in monsterSkills) {
				var skill = await Skill.findOne({ Name: key });

				if (skill) {
					var monsterSkill = new MonsterSkill();
					monsterSkill.Monster = monster;
					monsterSkill.Skill = skill;
					var bonus = Number(monsterSkills[key]);
					if (bonus || monsterSkills[key] == null) {
						monsterSkill.Bonus = bonus;
						skillsArray.push(monsterSkill);
					} else {
						messages.push("MonsterSkill value have to be either null or a number.")
					}
					
				} else {
					messages.push("Skill is invalid: " + key);
				}
			}
		}


		var savingThrowsArray = [];
		// MonsterSavingThrow
		var monsterSavingThrows = data.MonsterSavingThrows
		if (monsterSavingThrows) {
			for (const key in monsterSavingThrows) {
				var abilityScore = await AbilityScore.findOne({ Name: key });

				if (abilityScore) {
					var monsterSavingThrow = new MonsterSavingThrow();
					monsterSavingThrow.Monster = monster;
					monsterSavingThrow.AbilityScore = abilityScore;
					var bonus = Number(monsterSavingThrows[key]);
					if (bonus || monsterSavingThrows[key] == null) {
						monsterSavingThrow.Bonus = bonus;
						savingThrowsArray.push(monsterSavingThrow);
					} else {
						messages.push("MonsterSavingThrow value have to be either null or a number.")
					}
					
				} else {
					messages.push("AbilityScore is invalid: " + key);
				}
			}
		}


		var damageResistancesArray = [];
		// MonsterDamageTypeResistance
		var monsterDamageTypeResistances = data.MonsterDamageTypeResistances;
		if (monsterDamageTypeResistances) {
			for (const key in monsterDamageTypeResistances) {
				var damageType = await DamageType.findOne({ Name: key });

				if (damageType) {
					var monsterDamageTypeResistance = new MonsterDamageTypeResistance();
					monsterDamageTypeResistance.Monster = monster;
					monsterDamageTypeResistance.DamageType = damageType;
					var resistenceType = monsterDamageTypeResistances[key]

					if (ResistanceType[resistenceType]) {
						monsterDamageTypeResistance.Type = resistenceType;
						damageResistancesArray.push(monsterDamageTypeResistance);
					} else if (resistenceType == null) {
						damageResistancesArray.push(monsterDamageTypeResistance);
					} else {
						messages.push("ResistenceType value have to be one of the following: null, Vulnerable, Resistance, Immunit")
					}
				} else {
					messages.push("DamageType is invalid: " + key);
				}
			}
		}

		// Condition
		var monsterConditions = data.MonsterConditions;
		var conditionsArray = [];
		if (monsterConditions) {
			for (let conditionName of monsterConditions) {
				var condition = await Condition.findOne({ Name: conditionName });
				if (condition) {
					conditionsArray.push(condition);
				} else {
					messages.push("Condition is invalid: " + conditionName)
				}
			}
		}

		monster.ConditionImmunity = conditionsArray;

		monster.AbilityScores = abilityScoresArray;
		monster.Skills = skillsArray;
		monster.SavingThrows = savingThrowsArray;
		monster.DamageResistances = damageResistancesArray;

		// save to db
		if (messages.length == 0) {
			await monster.save();
			for (let abilityScore of abilityScoresArray) await abilityScore.save(); 
			for (let skill of skillsArray) await skill.save();
			for (let sawingThrow of savingThrowsArray) await sawingThrow.save();
			for (let damageResistence of damageResistancesArray) await damageResistence.save();
			return {
				"status": 201,
				"message": "success"
			}
		} else {
			return {
				"status": 400,
				"messages": messages
			}
		}
		
	}
}