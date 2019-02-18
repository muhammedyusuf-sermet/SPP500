import {Entity, Column, ManyToOne, BaseEntity} from "typeorm";
import { Monster } from "./Monster";
import { Skill } from "./Skill";

@Entity()
export class MonsterSkill extends BaseEntity {

    @ManyToOne(() => Monster, monster => monster.Skills, { primary: true })
    Monster: Monster;

    @ManyToOne(() => Skill, skill => skill.Monsters, { primary: true })
    Skill: Skill;
    
    @Column({
        type: "int",
        default: 0
    })
    Bonus: number;
    
}