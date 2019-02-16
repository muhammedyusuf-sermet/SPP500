import {Entity, Column, Index, PrimaryGeneratedColumn, ManyToMany} from "typeorm";
import { Monster } from "./Monster";

@Entity()
export class Condition {

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
        length: 500
    })
    Description: string;

    @ManyToMany(() => Monster, monster => monster.ConditionImmunity)
    ImmuneMonsters: Monster[];
}