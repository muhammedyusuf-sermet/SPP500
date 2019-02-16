import {Entity, Column, Index, PrimaryGeneratedColumn, ManyToOne, OneToMany, BaseEntity} from "typeorm";
import { AbilityScore } from "./AbilityScore";
import { MonsterSkill } from "./MonsterSkill";

@Entity()
export class Skill extends BaseEntity{

    @PrimaryGeneratedColumn()
    Id: number;

    @ManyToOne(() => AbilityScore, (abilityScore : AbilityScore) => abilityScore.Skills)
    AbilityScore: AbilityScore;

    @Index()
    @Column({
        type: "varchar",
        length: 50
    })
    Name: string;

    @Column({
        type: "varchar",
        length: 500
    })
    Description: string;

    @OneToMany(() => MonsterSkill, monsterSkill => monsterSkill.Skill)
    Monsters: MonsterSkill;

}