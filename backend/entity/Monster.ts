import { Entity, Column, Index, PrimaryGeneratedColumn, OneToMany, ManyToMany, BaseEntity, OneToOne, JoinColumn } from "typeorm";
import { MonsterAbilityScore } from "./MonsterAbilityScore";
import { MonsterSkill } from "./MonsterSkill";
import { MonsterSavingThrow } from "./MonsterSavingThrow";
import { Encounter } from "./Encounter";
import { Size, MonsterType, MonsterRace, Alignment, Environment } from "./MonsterEnums";
import { Action } from "./Action";

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
        enum: Environment,
        default: Environment.Grassland
    })
    Environment: Environment;

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
    HitPointDistribution: string;

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
        type: "varchar",
        length: 200,
        nullable: true
    })
    DamageVulnerabilities: string;

    @Column({
        type: "varchar",
        length: 200,
        nullable: true
    })
    DamageResistances: string;

    @Column({
        type: "varchar",
        length: 200,
        nullable: true
    })
    DamageImmunities: string;

    @Column({
        type: "varchar",
        length: 200,
        nullable: true
    })
    ConditionImmunities: string;

    @Column({
        type: "float",
        default: 1
    })
    ChallengeRating: number;
    
    @OneToOne(() => MonsterAbilityScore, monsterAbilityScore => monsterAbilityScore.Monster)
    @JoinColumn()
    AbilityScores: MonsterAbilityScore;

    @OneToMany(() => MonsterSkill, monsterSkill => monsterSkill.Monster)
    Skills: MonsterSkill[];

    @OneToOne(() => MonsterSavingThrow, monsterSavingThrow => monsterSavingThrow.Monster)
    @JoinColumn()
    SavingThrows: MonsterSavingThrow;

    @OneToMany(() => Action, action => action.Monster)
    Actions: Action[];

    @ManyToMany(() => Encounter, encounter => encounter.Monsters)
    Encounters: Encounter[];

}