import { Monster } from "./Monster";
import { AbilityScore } from "./AbilityScore";

export class MonsterSavingThrow {
	Monster: Monster;
	AbilityScore: AbilityScore;
	Bonus: number;

	static monsterSavingThrows: MonsterSavingThrow[] = [];

    save() {
        MonsterSavingThrow.monsterSavingThrows.push(this)
    }
}