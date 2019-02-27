import { Entity, Column, Index, PrimaryGeneratedColumn, OneToMany, BaseEntity } from "typeorm";
import { Skill } from "./Skill";

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
}