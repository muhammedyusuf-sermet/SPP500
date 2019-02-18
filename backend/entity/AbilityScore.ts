import {Entity, Column, Index, PrimaryGeneratedColumn, OneToMany, BaseEntity} from "typeorm";
import { Skill } from "./Skill";
import { MonsterAbilityScore } from "./MonsterAbilityScore";
import { MonsterSavingThrow } from "./MonsterSavingThrow";

@Entity()
export class AbilityScore extends BaseEntity {

    @PrimaryGeneratedColumn()
    Id: number;

    @Index()
    @Column({
        type: "varchar",
        length: 50
    })
    Name: string;

    @Column({
        type: "varchar",
        length: 3
    })
    Abbreviation: string;

    @Column({
        type: "varchar",
        length: 500
    })
    Description: string;
    
    @OneToMany(() => Skill, skill => skill.AbilityScore)
    Skills: Skill[];
    
    @OneToMany(() => MonsterAbilityScore, monsterAbilityScore => monsterAbilityScore.AbilityScore)
    Monsters: MonsterAbilityScore[];

    @OneToMany(() => MonsterSavingThrow, monsterSavingThrow => monsterSavingThrow.AbilityScore)
    SavingThrows: MonsterSavingThrow[];

}