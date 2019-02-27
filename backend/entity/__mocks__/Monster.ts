// import { MonsterAbilityScore } from "./MonsterAbilityScore";
// import { MonsterSkill } from "./MonsterSkill";
// import { MonsterSavingThrow } from "./MonsterSavingThrow";
// import { MonsterDamageTypeResistance } from "./MonsterDamageTypeResistance";
import { Size, MonsterType, MonsterRace, Alignment } from "../Monster"

export class Monster {
    Name: string;
    Size: Size;
    Type: MonsterType;
    Race: MonsterRace;
    Alignment: Alignment;
    ArmorClass: number;
    HitPoints: number;
    Damage: string;
    Speed: string;
    Senses: string;
    Languages: string;
    ChallengeRating: number;
    // AbilityScores: MonsterAbilityScore[];
    // Skills: MonsterSkill[];
    // SavingThrows: MonsterSavingThrow[];
    // DamageResistances: MonsterDamageTypeResistance[];
    ConditionImmunity: number[];

    [key: string]: string|number[]|number|(()=>void);

    static monsters: Monster[] = [];

    static find(a: any) {
        var result = Monster.monsters.slice(0);
        for (let key in a) {
            let value = a[key];
            result = result.filter(function (el: Monster) {
                return el[key] == value;
            });
        }

        return result
    }

    static findOne(a: any) {
        return this.find(a)[0]
    }

    save() {
        Monster.monsters.push(this)
    }
}