import { Entity, Column, BaseEntity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Monster } from "./Monster";

@Entity()
export class MonsterAbilityScore extends BaseEntity {

    @PrimaryGeneratedColumn()
	Id: number;

    @OneToOne(() => Monster, monster => monster.AbilityScores)
    Monster: Monster;
    
    // each of these is the actual stat.
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