import { Monster } from "./Monster";
import { Sense } from "./Sense";

export class MonsterSense {
	Monster: Monster;
	Sense: Sense;
	Bonus: number;

	static TableRows: MonsterSense[] = [];

	static save(monsterSenses: MonsterSense[]){
		this.TableRows.push(...monsterSenses);
	}

	save() {
		MonsterSense.TableRows.push(this)
	}
}