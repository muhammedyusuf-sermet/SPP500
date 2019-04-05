import { Monster } from "./Monster";

export class MonsterSavingThrow {
	Monster: Monster;
	Strength: number = 0;
	Dexterity: number = 0;
	Constitution: number = 0;
	Intelligence: number = 0;
	Wisdom: number = 0;
	Charisma: number = 0;

	static TableRows: MonsterSavingThrow[] = [];

	constructor(m: Monster){
		this.Monster = m;
	}

	save() {
		MonsterSavingThrow.TableRows.push(this)
	}
}