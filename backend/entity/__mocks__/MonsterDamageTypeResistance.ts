import { Monster } from "./Monster";
import { DamageType } from "./DamageType";

export enum ResistanceType {
    Vulnerable = "Vulnerable",
    Resistance = "Resistance",
    Immunit = "Immunit"
}

export class MonsterDamageTypeResistance {
    Monster: Monster;
    DamageType: DamageType;
    Type: ResistanceType;

    static TableRows: MonsterDamageTypeResistance[] = [];

    save() {
        MonsterDamageTypeResistance.TableRows.push(this)
    }
}