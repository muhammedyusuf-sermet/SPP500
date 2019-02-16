import {Entity, Column, Index, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import { Skill } from "./Skill";
import { MonsterAbilityScore } from "./MonsterAbilityScore";

@Entity()
export class AbilityScore {

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
    
    @OneToMany(() => Skill, (skill : Skill) => skill.AbilityScore)
    Skills: Skill[];
    
    @OneToMany(() => MonsterAbilityScore, monsterAbilityScore => monsterAbilityScore.AbilityScore)
    Monsters: MonsterAbilityScore[];

}