import {Size, MonsterType, MonsterRace, Alignment, Monster} from "./entity/Monster";
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
export class MonsterFactory {
	public async Create(request: {payload: any}) {
		var data = request.payload;
		const monster = new Monster();
		
		var messages = [];

		// check if fields with no defaults are provided
		// if not raise an error
		// only name is required
		if (!data.Name) {
			messages.push("Name must be provided.");
		}

		monster.Name = data.Name;

		if (data.Senses) {
			monster.Senses = data.Senses;
		}


		if (data.Languages) {
			monster.Languages = data.Languages;
		}
		

		if (data.DamageVulnerabilities) {
			monster.DamageVulnerabilities = data.DamageVulnerabilities;
		}
		

		if (data.DamageResistances) {
			monster.DamageResistances = data.DamageResistances;
		}
		

		if (data.DamageImmunities) {
			monster.DamageImmunities = data.DamageImmunities;
		}
		

		if (data.ConditionImmunities) {
			monster.ConditionImmunities = data.ConditionImmunities;
		}
		


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
		// if not do not assign them
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
		
		// var abilityScoresArray = [];

		// MonsterAbilityScore
		var abilityScore = data.AbilityScores
		if (abilityScore) {
			var monsterAbilityScore = new MonsterAbilityScore();
			monsterAbilityScore.Monster = monster;

			if (abilityScore.Strength && typeof abilityScore.Strength !== 'number') {
				messages.push("Strength value for AbilityScores is not valid: " + abilityScore.Strength)
			} else {
				monsterAbilityScore.Strength = abilityScore.Strength;
			}

			if (abilityScore.Dexterity && typeof abilityScore.Dexterity !== 'number') {
				messages.push("Dexterity value for AbilityScores is not valid: " + abilityScore.Dexterity)
			} else {
				monsterAbilityScore.Dexterity = abilityScore.Dexterity;
			}

			if (abilityScore.Constitution && typeof abilityScore.Constitution !== 'number') {
				messages.push("Constitution value for AbilityScores is not valid: " + abilityScore.Constitution)
			} else {
				monsterAbilityScore.Constitution = abilityScore.Constitution;
			}

			if (abilityScore.Intelligence && typeof abilityScore.Intelligence !== 'number') {
				messages.push("Intelligence value for AbilityScores is not valid: " + abilityScore.Intelligence)
			} else {
				monsterAbilityScore.Intelligence = abilityScore.Intelligence;
			}
			
			if (abilityScore.Wisdom && typeof abilityScore.Wisdom !== 'number') {
				messages.push("Wisdom value for AbilityScores is not valid: " + abilityScore.Wisdom)
			} else {
				monsterAbilityScore.Wisdom = abilityScore.Wisdom;
			}

			if (abilityScore.Charisma && typeof abilityScore.Charisma !== 'number') {
				messages.push("Charisma value for AbilityScores is not valid: " + abilityScore.Charisma)
			} else {
				monsterAbilityScore.Charisma = abilityScore.Charisma;
			}

		}

		// MonsterSavingThrow
		var savingThrow = data.SavingThrows
		if (savingThrow) {
			var monsterSavingThrow = new MonsterSavingThrow();
			monsterSavingThrow.Monster = monster;

			if (savingThrow.Strength && typeof savingThrow.Strength !== 'number') {
				messages.push("Strength value for SavingThrows is not valid: " + savingThrow.Strength)
			} else {
				monsterSavingThrow.Strength = savingThrow.Strength;
			}

			if (savingThrow.Dexterity && typeof savingThrow.Dexterity !== 'number') {
				messages.push("Dexterity value for SavingThrows is not valid: " + savingThrow.Dexterity)
			} else {
				monsterSavingThrow.Dexterity = savingThrow.Dexterity;
			}

			if (savingThrow.Constitution && typeof savingThrow.Constitution !== 'number') {
				messages.push("Constitution value for SavingThrows is not valid: " + savingThrow.Constitution)
			} else {
				monsterSavingThrow.Constitution = savingThrow.Constitution;
			}

			if (savingThrow.Intelligence && typeof savingThrow.Intelligence !== 'number') {
				messages.push("Intelligence value for SavingThrows is not valid: " + savingThrow.Intelligence)
			} else {
				monsterSavingThrow.Intelligence = savingThrow.Intelligence;
			}
			
			if (savingThrow.Wisdom && typeof savingThrow.Wisdom !== 'number') {
				messages.push("Wisdom value for SavingThrows is not valid: " + savingThrow.Wisdom)
			} else {
				monsterSavingThrow.Wisdom = savingThrow.Wisdom;
			}

			if (savingThrow.Charisma && typeof savingThrow.Charisma !== 'number') {
				messages.push("Charisma value for SavingThrows is not valid: " + savingThrow.Charisma)
			} else {
				monsterSavingThrow.Charisma = savingThrow.Charisma;
			}
		}

		var skillsArray = [];
		// MonsterSkill
		var monsterSkills = data.Skills
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
						messages.push("MonsterSkill value has to be either null or a number.")
					}
					
				} else {
					messages.push("Skill is invalid: " + key);
				}
			}
		}


		monster.AbilityScores = abilityScore;
		monster.SavingThrows = savingThrow;
		monster.Skills = skillsArray;
		

		// save to db
		if (messages.length == 0) {
			await monster.save();
			for (let skill of skillsArray) await skill.save();

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