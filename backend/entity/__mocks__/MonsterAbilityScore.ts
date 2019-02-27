import { AbilityScore } from "./AbilityScore";
import { Monster } from "./Monster";

export class MonsterAbilityScore {
	Monster: Monster;
	AbilityScore: AbilityScore;
    Score: number;

    static TableRows: MonsterAbilityScore[] = [];

    save() {
        MonsterAbilityScore.TableRows.push(this)
    }
}