import { Monster } from "./Monster";

export class MonsterSavingThrow {
	Monster: Monster;
	Strength: number;
	Dexterity: number;
	Constitution: number;
	Intelligence: number;
	Wisdom: number;
	Charisma: number;

	static TableRows: MonsterSavingThrow[] = [];

    save() {
        MonsterSavingThrow.TableRows.push(this)
    }
}