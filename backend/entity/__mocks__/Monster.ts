import { MonsterAbilityScore } from "./MonsterAbilityScore";
import { MonsterSkill } from "./MonsterSkill";
import { MonsterSavingThrow } from "./MonsterSavingThrow";
import { Action } from "./Action";
import { Size, MonsterType, MonsterRace, Alignment, Environment } from "../MonsterEnums";
import { MonsterSense } from "../MonsterSense";

export class Monster {
	Id: number;
	Name: string;
	Size: Size = Size.Medium;
	Type: MonsterType = MonsterType.Beast;
	Race: MonsterRace = MonsterRace.AnyRace;
	Alignment: Alignment = Alignment.Unaligned;
	Environment: Environment = Environment.Grassland
	ArmorClass: number = 12;
	HitPoints: number = 12;
	HitPointDistribution: string = "2d8";
	Speed: string = "30 ft.";
	Languages: string = '';
	DamageVulnerabilities: string = '';
	DamageResistances: string = '';
	DamageImmunities: string = '';
	ConditionImmunities: string = '';
    ChallengeRating: number = 1;
	AbilityScores: MonsterAbilityScore;
	Skills: MonsterSkill[] = [];
	Senses: MonsterSense[] = [];
	SavingThrows: MonsterSavingThrow;
	Actions: Action[] = [];

	[key: string]: string|number|MonsterAbilityScore|MonsterSkill[]|MonsterSense[]|MonsterSavingThrow|Action[]|(()=>void);

	constructor(){
		this.AbilityScores = new MonsterAbilityScore(this);
		this.SavingThrows = new MonsterSavingThrow(this);
	}

	static TableRows: Monster[] = [];

	static find(a: any): Monster[] {
		var result = Monster.TableRows.slice(0);
		var skip = -1;
		var take = -1;

		for (let key in a) {
			let value = a[key];

			if (key == "skip") {
				skip = value;
			} else if (key == "take") {
				take = value;
			} else if (key == 'where') {
				return Monster.find(value);
			} else if (key == 'relations') {
				// skip this key
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

	remove() {
		Monster.TableRows.splice(Monster.TableRows.lastIndexOf(this),1);
	}

	save() {
		for(let monster of Monster.TableRows) {
			if(monster.Id == this.Id){
				Object.assign(monster, this);
				return
			}
		}
		Monster.TableRows.push(this);
	}

	static clear() {
		Monster.TableRows = [];
	}

}