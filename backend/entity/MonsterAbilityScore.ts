import {Entity, Column, BaseEntity, OneToOne} from "typeorm";
import { Monster } from "./Monster";

@Entity()
export class MonsterAbilityScore extends BaseEntity {

    @OneToOne(() => Monster, monster => monster.AbilityScores, { primary: true })
    Monster: Monster;
    
    @Column({
        type: "int",
        default: 1
    })
    Strength: number;
    
    @Column({
        type: "int",
        default: 1
    })
    Dexterity: number;

    @Column({
        type: "int",
        default: 1
    })
    Constitution: number;

    @Column({
        type: "int",
        default: 1
    })
    Intelligence: number;

    @Column({
        type: "int",
        default: 1
    })
    Wisdom: number;

    @Column({
        type: "int",
        default: 1
    })
    Charisma: number;
}