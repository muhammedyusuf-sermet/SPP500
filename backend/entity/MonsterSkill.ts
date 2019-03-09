import { Entity, Column, ManyToOne, BaseEntity } from "typeorm";
import { Monster, IMonsterData } from "./Monster";
import { Skill, ISkillData } from "./Skill";

export interface IMonsterSkillData {
    Monster: IMonsterData;
    Skill: ISkillData;
    
    Bonus: number;
}

@Entity()
export class MonsterSkill extends BaseEntity implements IMonsterSkillData {

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