import { Monster } from "./Monster";

export class MonsterAbilityScore {
	Monster: Monster;
	Strength: number = 1;
	Dexterity: number = 1;
	Constitution: number = 1;
	Intelligence: number = 1;
	Wisdom: number = 1;
	Charisma: number = 1;

	static TableRows: MonsterAbilityScore[] = [];

	constructor(m: Monster){
		this.Monster = m;
	}

	save() {
		MonsterAbilityScore.TableRows.push(this)
	}
}