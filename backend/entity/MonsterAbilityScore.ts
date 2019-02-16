import {Entity, Column, Index, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import { Monster } from "./Monster";
import { AbilityScore } from "./AbilityScore";

@Entity()
export class MonsterAbilityScore {

    @ManyToOne(() => Monster, monster => monster.AbilityScores, { primary: true })
    Monster: Monster;

    @ManyToOne(() => AbilityScore, abilityScore => abilityScore.Monsters, { primary: true })
    AbilityScore: AbilityScore;
    
    @Column({
        type: "int",
        default: 1
    })
    Score: number;
    
}