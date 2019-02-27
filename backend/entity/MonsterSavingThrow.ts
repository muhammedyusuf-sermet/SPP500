import { Entity, Column, BaseEntity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Monster } from "./Monster";

@Entity()
export class MonsterSavingThrow extends BaseEntity {

    @PrimaryGeneratedColumn()
	Id: number;

    @OneToOne(() => Monster, monster => monster.SavingThrows)
    Monster: Monster;
    
    // each of these is a bonus to the type of saving throw
    @Column({
        type: "int",
        default: 0
    })
    Strength: number;
    
    @Column({
        type: "int",
        default: 0
    })
    Dexterity: number;

    @Column({
        type: "int",
        default: 0
    })
    Constitution: number;

    @Column({
        type: "int",
        default: 0
    })
    Intelligence: number;

    @Column({
        type: "int",
        default: 0
    })
    Wisdom: number;

    @Column({
        type: "int",
        default: 0
    })
    Charisma: number;
    
}