import {Entity, Column, Index, PrimaryGeneratedColumn, OneToMany, BaseEntity} from "typeorm";
import { MonsterDamageTypeResistance } from "./MonsterDamageTypeResistance";

@Entity()
export class DamageType extends BaseEntity {

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
    ResistantMonsters: MonsterDamageTypeResistance[];

}