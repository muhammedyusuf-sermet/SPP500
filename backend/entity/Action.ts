import { Entity, Column, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { MonsterAction } from "./MonsterEnums";

@Entity()
export class Action extends BaseEntity {

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