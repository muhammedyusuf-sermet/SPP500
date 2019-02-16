import {Entity, Column, ManyToOne} from "typeorm";
import { Monster } from "./Monster";
import { AbilityScore } from "./AbilityScore";
import { DamageType } from "./DamageType";

export enum ResistanceType {
    Vulnerable = "Vulnerable",
    Resistance = "Resistance",
    Immunit = "Immunit"
}

@Entity()
export class MonsterDamageTypeResistance {

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