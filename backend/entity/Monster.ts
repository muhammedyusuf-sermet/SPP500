import {Entity, Column, Index, PrimaryGeneratedColumn, OneToMany, ManyToMany, BaseEntity, JoinTable, OneToOne} from "typeorm";
import { MonsterAbilityScore } from "./MonsterAbilityScore";
import { MonsterSkill } from "./MonsterSkill";
import { MonsterSavingThrow } from "./MonsterSavingThrow";
import { MonsterDamageTypeResistance } from "./MonsterDamageTypeResistance";
import { Condition } from "./Condition";
import { Encounter } from "./Encounter";

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

@Entity()
export class Monster extends BaseEntity {

    @PrimaryGeneratedColumn()
    Id: number;

    @Index()
    @Column({
        type: "varchar",
        length: 50
    })
    Name: string;

    @Column({
        type: "enum",
        enum: Size,
        default: Size.Medium
    })
    Size: Size;

    @Column({
        type: "enum",
        enum: MonsterType,
        default: MonsterType.Beast
    })
    Type: MonsterType;

    @Column({
        type: "enum",
        enum: MonsterRace,
        default: MonsterRace.AnyRace
    })
    Race: MonsterRace;

    @Column({
        type: "enum",
        enum: Alignment,
        default: Alignment.Unaligned
    })
    Alignment: Alignment;

    @Column({
        type: "int",
        default: 12
    })
    ArmorClass: number;

    @Column({
        type: "int",
        default: 12
    })
    HitPoints: number;

    @Column({
        type: "varchar",
        length: 20,
        default: "2d8"
    })
    Damage: string;

    @Column({
        type: "varchar",
        length: 100,
        default: "30 ft."
    })
    Speed: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    Senses: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: true
    })
    Languages: string;

    @Column({
        type: "int",
        default: 1
    })
    ChallengeRating: number;
    
    @OneToOne(() => MonsterAbilityScore, monsterAbilityScore => monsterAbilityScore.Monster)
    AbilityScores: MonsterAbilityScore;

    @OneToMany(() => MonsterSkill, monsterSkill => monsterSkill.Monster)
    Skills: MonsterSkill[];

    @OneToOne(() => MonsterSavingThrow, monsterSavingThrow => monsterSavingThrow.Monster)
    SavingThrows: MonsterSavingThrow;

    @OneToMany(() => MonsterDamageTypeResistance, monsterDamageTypeResistance => monsterDamageTypeResistance.Monster)
    DamageResistances: MonsterDamageTypeResistance[];
    
    @ManyToMany(() => Condition, condition => condition.ImmuneMonsters)
    @JoinTable()
    ConditionImmunity: Condition[];

    @ManyToMany(() => Encounter, encounter => encounter.Monsters)
    Encounters: Encounter[];

}