import { Monster } from "./Monster";
import { Skill } from "./Skill";

export class MonsterSkill {
	Monster: Monster;
	Skill: Skill;
	Bonus: number;

	static monsterSkills: MonsterSkill[] = [];

    save() {
        MonsterSkill.monsterSkills.push(this)
    }
}