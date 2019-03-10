import { Monster } from "./Monster";
import { Skill } from "./Skill";

export class MonsterSkill {
	Monster: Monster;
	Skill: Skill;
	Bonus: number;

	static TableRows: MonsterSkill[] = [];

	static save(monsterSkills: MonsterSkill[]){
		this.TableRows.push(...monsterSkills);
	}

	save() {
		MonsterSkill.TableRows.push(this)
	}
}