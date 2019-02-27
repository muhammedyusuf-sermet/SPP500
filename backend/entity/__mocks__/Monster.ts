import { MonsterAbilityScore } from "./MonsterAbilityScore";
import { MonsterSkill } from "./MonsterSkill";
import { MonsterSavingThrow } from "./MonsterSavingThrow";

export enum Size {
    Tiny = "Tiny",
    Small = "Small",
    Medium = "Medium",
    Large = "Large",
    Huge = "Huge",
    Gargantuan = "Gargantuan"
}

export enum MonsterType {
    Beast = "Beast",
    Dragon = "Dragon",
    Monstrosity = "Monstrosity",
    Humanoid = "Humanoid",
    Fiend = "Fiend",
    Undead = "Undead",
    Giant = "Giant",
    Elemental = "Elemental",
    SwarmOfTinyBeasts = "SwarmOfTinyBeasts",
    Construct = "Construct",
    Celestial = "Celestial",
    Aberration = "Aberration",
    Fey = "Fey",
    Plant = "Plant",
    Ooze = "Ooze"
}

export enum MonsterRace {
    AnyRace = "AnyRace",
    Devil = "Devil",
    Demon = "Demon",
    Human = "Human",
    Shapechanger = "Shapechanger",
    Goblinoid = "Goblinoid",
    Titan = "Titan",
    Gnoll = "Gnoll",
    Gnome = "Gnome",
    Dwarf = "Dwarf",
    Elf = "Elf",
    Orc = "Orc",
    Kobold = "Kobold",
    Lizardfolk = "Lizardfolk",
    Merfolk = "Merfolk",
    Sahuagin = "Sahuagin",
    Grimlock = "Grimlock"
}

export enum Alignment {
    Unaligned = "Unaligned",
    AnyAlignment = "AnyAlignment",
    LawfulDood = "LawfulDood",
    LawfulNeutral = "LawfulNeutral",
    LawfulEvil = "LawfulEvil",
    NeutralGood = "NeutralGood",
    Neutral = "Neutral",
    NeutralEvil = "NeutralEvil",
    ChaoticGood = "ChaoticGood",
    ChaoticNeutral = "ChaoticNeutral",
    ChaoticEvil = "ChaoticEvil"
}

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
    DamageVulnerabilities: string;
    DamageResistances: string;
    DamageImmunities: string;
    ConditionImmunities: string;
    ChallengeRating: number;
    AbilityScores: MonsterAbilityScore[];
    Skills: MonsterSkill[];
    SavingThrows: MonsterSavingThrow[];

    [key: string]: string|number|MonsterAbilityScore[]|MonsterSkill[]|MonsterSavingThrow[]|(()=>void);

    static TableRows: Monster[] = [];

    static find(a: any) {
        var result = Monster.TableRows.slice(0);
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
        Monster.TableRows.push(this)
    }
}