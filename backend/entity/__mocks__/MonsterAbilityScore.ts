import { AbilityScore } from "./AbilityScore";
import { Monster } from "./Monster";

export class MonsterAbilityScore {
	Monster: Monster;
	AbilityScore: AbilityScore;
    Score: number;

    static monsterAbilityScores: MonsterAbilityScore[] = [];

    save() {
        MonsterAbilityScore.monsterAbilityScores.push(this)
    }
}