import { Entity, Column, Index, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm";
import { MonsterAction } from "./MonsterEnums";
import { Monster } from "./Monster";

export interface IActionData {
    Name: string,
    Description: string,
    HitBonus?: number,
    Damage?: string,
    DamageBonus?: number,
    Type?: MonsterAction
}

@Entity()
export class Action extends BaseEntity implements IActionData {

    @PrimaryGeneratedColumn()
    Id: number;

    @ManyToOne(() => Monster, monster => monster.Actions)
    Monster: Monster;

    @Index()
    @Column({
        type: "varchar",
        length: 50
    })
    Name: string;

    @Column({
        type: "varchar",
        length: 250
    })
    Description: string;
    
    @Column({
        type: "int",
        default: 0
    })
    HitBonus: number;

    @Column({
        type: "varchar",
        length: 20,
        nullable: true
    })
    Damage: string;

    @Column({
        type: "int",
        default: 0
    })
    DamageBonus: number;

    @Column({
        type: "enum",
        enum: MonsterAction,
        default: MonsterAction.Action
    })
    Type: MonsterAction;

}