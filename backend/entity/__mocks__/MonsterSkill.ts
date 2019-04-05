import { Monster } from "./Monster";
import { Skill } from "./Skill";

export class MonsterSkill {
	Monster: Monster;
	Skill: Skill;
	Bonus: number;

	static TableRows: MonsterSkill[] = [];

	static remove(monsterSenses: MonsterSkill[]) {
		for( var i = 0; i < MonsterSkill.TableRows.length; i++){ 
			for (let monster of monsterSenses) {
				if (monster.Monster.Id == MonsterSkill.TableRows[i].Monster.Id &&
					monster.Skill.Id == MonsterSkill.TableRows[i].Skill.Id)
					MonsterSkill.TableRows.splice(i, 1);
					i--;
					break;
			}
		}
	}

	static save(monsterSkills: MonsterSkill[]){
		this.TableRows.push(...monsterSkills);
	}

	save() {
		MonsterSkill.TableRows.push(this)
	}
}