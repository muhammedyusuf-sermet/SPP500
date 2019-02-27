import { Monster } from "./Monster";
import { Skill } from "./Skill";

export class MonsterSkill {
	Monster: Monster;
	Skill: Skill;
	Bonus: number;

	static TableRows: MonsterSkill[] = [];

    save() {
        MonsterSkill.TableRows.push(this)
    }
}