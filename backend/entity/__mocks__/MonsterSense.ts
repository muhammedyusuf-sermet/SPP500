import { Monster } from "./Monster";
import { Sense } from "./Sense";

export class MonsterSense {
	Monster: Monster;
	Sense: Sense;
	Bonus: number;

	static TableRows: MonsterSense[] = [];

	static remove(monsterSenses: MonsterSense[]) {
		for( var i = 0; i < MonsterSense.TableRows.length; i++){ 
			for (let monster of monsterSenses) {
				if (monster.Monster.Id == MonsterSense.TableRows[i].Monster.Id &&
					monster.Sense.Id == MonsterSense.TableRows[i].Sense.Id)
					MonsterSense.TableRows.splice(i, 1);
					i--;
					break;
			}
		}
	}

	static save(monsterSenses: MonsterSense[]) {
		this.TableRows.push(...monsterSenses);
	}

	save() {
		MonsterSense.TableRows.push(this)
	}
}