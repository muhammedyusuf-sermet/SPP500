import {Entity, Column, Index, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import { AbilityScore } from "./AbilityScore";

@Entity()
export class Skill {

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

}