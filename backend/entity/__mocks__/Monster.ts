import { MonsterAbilityScore } from "./MonsterAbilityScore";
import { MonsterSkill } from "./MonsterSkill";
import { MonsterSavingThrow } from "./MonsterSavingThrow";
import { Action } from "./Action";
import { Size, MonsterType, MonsterRace, Alignment } from "../MonsterEnums";

export class Monster {
	Name: string;
	Size: Size;
	Type: MonsterType;
	Race: MonsterRace;
	Alignment: Alignment;
	ArmorClass: number;
	HitPoints: number;
	Damage: string;
	Speed: string;
	Senses: string;
	Languages: string;
	DamageVulnerabilities: string;
	DamageResistances: string;
	DamageImmunities: string;
	ConditionImmunities: string;
    ChallengeRating: number;
	AbilityScores: MonsterAbilityScore;
	Skills: MonsterSkill[];
	SavingThrows: MonsterSavingThrow;
	Actions: Action[];

	[key: string]: string|number|MonsterAbilityScore|MonsterSkill[]|MonsterSavingThrow|Action[]|(()=>void);

	static TableRows: Monster[] = [];

	static find(a: any) {
		var result = Monster.TableRows.slice(0);
		var skip = -1;
		var take = -1;

		for (let key in a) {
			let value = a[key];

			if (key == "skip") {
				skip = value;
			} else if (key == "take") {
				take = value;
			} else {
				result = result.filter(function (el: Monster) {
					return el[key] == value;
				});
			}
		}

		if (skip > 0) {
			result = result.slice(skip, result.length)
		}

		if (take > 0) {
			result = result.slice(0, take)
		}

		return result
	}

	static findOne(a: any) {
		return this.find(a)[0]
	}

	save() {
		Monster.TableRows.push(this)
	}

	static clear() {
		Monster.TableRows = [];
	}

}