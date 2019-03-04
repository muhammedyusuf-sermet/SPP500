import { Entity, Column, Index, PrimaryGeneratedColumn, ManyToOne, OneToMany, BaseEntity } from "typeorm";
import { AbilityScore, IAbilityScoreData } from "./AbilityScore";
import { MonsterSkill, IMonsterSkillData } from "./MonsterSkill";

export interface ISkillData {
    AbilityScore: IAbilityScoreData;

    Name: string;
    Description: string;

    Monsters: IMonsterSkillData[];
}

@Entity()
export class Skill extends BaseEntity implements ISkillData {

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
    Monsters: MonsterSkill[];

}