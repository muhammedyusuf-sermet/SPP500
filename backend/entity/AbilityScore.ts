import { Entity, Column, Index, PrimaryGeneratedColumn, OneToMany, BaseEntity } from "typeorm";
import { Skill, ISkillData } from "./Skill";

export interface IAbilityScoreData {
    Name: string;
    Abbreviation: string;
    Description: string;
    
    Skills: ISkillData[];
}

@Entity()
export class AbilityScore extends BaseEntity implements IAbilityScoreData {

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
}