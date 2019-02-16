import {Entity, Column, Index, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import { MonsterDamageTypeResistance } from "./MonsterDamageTypeResistance";

@Entity()
export class DamageType {

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

    @OneToMany(() => MonsterDamageTypeResistance, monsterDamageTypeResistance => monsterDamageTypeResistance.DamageType)
    MonsterResistance: MonsterDamageTypeResistance[];

}