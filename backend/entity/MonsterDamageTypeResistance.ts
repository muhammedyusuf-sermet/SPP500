import {Entity, Column, ManyToOne, BaseEntity} from "typeorm";
import { Monster } from "./Monster";
import { DamageType } from "./DamageType";

export enum ResistanceType {
    Vulnerable = "Vulnerable",
    Resistance = "Resistance",
    Immunit = "Immunit"
}

@Entity()
export class MonsterDamageTypeResistance extends BaseEntity {

    @ManyToOne(() => Monster, monster => monster.DamageResistances, { primary: true })
    Monster: Monster;

    @ManyToOne(() => DamageType, damageType => damageType.ResistantMonsters, { primary: true })
    DamageType: DamageType;
    
    @Column({
        type: "enum",
        enum: ResistanceType,
        default: ResistanceType.Resistance
    })
    Type: ResistanceType;
    
}