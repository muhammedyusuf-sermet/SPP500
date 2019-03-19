import { Entity, Column, ManyToOne, BaseEntity } from "typeorm";
import { Monster, IMonsterData } from "./Monster";
import { Sense, ISenseData } from "./Sense";

export interface IMonsterSenseData {
    Monster: IMonsterData;
    Sense: ISenseData;
    
    Bonus: number;
}

@Entity()
export class MonsterSense extends BaseEntity implements IMonsterSenseData {

    @ManyToOne(() => Monster, monster => monster.Skills, { primary: true })
    Monster: Monster;

    @ManyToOne(() => Sense, sense => sense.Monsters, { primary: true })
    Sense: Sense;
    
    @Column({
        type: "int",
        default: 0
    })
    Bonus: number;
	
	
}