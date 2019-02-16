import {Entity, Column, ManyToOne, BaseEntity} from "typeorm";
import { Monster } from "./Monster";
import { AbilityScore } from "./AbilityScore";

@Entity()
export class MonsterAbilityScore extends BaseEntity {

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