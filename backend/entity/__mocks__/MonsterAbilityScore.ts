import { Monster } from "./Monster";

export class MonsterAbilityScore {
	Monster: Monster;
	Strength: number;
	Dexterity: number;
	Constitution: number;
	Intelligence: number;
	Wisdom: number;
	Charisma: number;

    static TableRows: MonsterAbilityScore[] = [];

    save() {
        MonsterAbilityScore.TableRows.push(this)
    }
}