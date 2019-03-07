import { Entity, Column, BaseEntity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Monster } from "./Monster";

export interface IMonsterSavingThrowData {
    Strength?: number;
    Dexterity?: number;
    Constitution?: number;
    Intelligence?: number;
    Wisdom?: number;
    Charisma?: number;
}

@Entity()
export class MonsterSavingThrow extends BaseEntity implements IMonsterSavingThrowData {

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