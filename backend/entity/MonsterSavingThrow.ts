import {Entity, Column, ManyToOne, BaseEntity} from "typeorm";
import { Monster } from "./Monster";
import { AbilityScore } from "./AbilityScore";

@Entity()
export class MonsterSavingThrow extends BaseEntity {

    @ManyToOne(() => Monster, monster => monster.SavingThrows, { primary: true })
    Monster: Monster;

    @ManyToOne(() => AbilityScore, abilityScore => abilityScore.SavingThrows, { primary: true })
    AbilityScore: AbilityScore;
    
    @Column({
        type: "int",
        default: 0
    })
    Bonus: number;
    
}