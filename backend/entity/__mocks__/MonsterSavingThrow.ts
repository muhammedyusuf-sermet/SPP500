import { Monster } from "./Monster";
import { AbilityScore } from "./AbilityScore";

export class MonsterSavingThrow {
	Monster: Monster;
	AbilityScore: AbilityScore;
	Bonus: number;

	static TableRows: MonsterSavingThrow[] = [];

    save() {
        MonsterSavingThrow.TableRows.push(this)
    }
}