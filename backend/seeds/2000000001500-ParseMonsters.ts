import {MigrationInterface, QueryRunner} from "typeorm";
import Data from './data/monsters.json';
import { Monster } from "../entity/Monster";
import { MonsterSkill } from "../entity/MonsterSkill";
import { MonsterAbilityScore } from "../entity/MonsterAbilityScore";
import { MonsterSavingThrow } from "../entity/MonsterSavingThrow";
import { Action } from "../entity/Action";
import { Skill } from "../entity/Skill";

export class ParseMonsters2000000001500 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        
        const allSkills: Skill[] = await queryRunner.manager
            .createQueryBuilder(Skill, "skill") 
            .select("skill")
            .getMany();

        const skillLookup: Map<string,Skill> = new Map();
        allSkills.forEach((value: Skill) => {
            skillLookup.set(value.Name , value)
        });

        let monsters: Array<Monster> = Data.map(value => {
            const monster: Monster = Object.assign(new Monster(),value);
            monster.Actions = [];
            if (value.Actions) {
                for (let act of value.Actions) {
                    const action:Action = Object.assign(new Action(), act);
                    action.Monster = monster;
                    monster.Actions.push(action);
                }
            }
            monster.Skills = []
            if (value.Skills) {
                for (let skill of value.Skills) {
                    const monsterSkill: MonsterSkill = new MonsterSkill();
                    monsterSkill.Monster = monster;
                    const skillObj = skillLookup.get(skill.Name);
                    if (skillObj)
                        monsterSkill.Skill = skillObj;
                    monsterSkill.Bonus = skill.Bonus;
                    monster.Skills.push(monsterSkill);
                }
            }
            return monster;
        });

        for (let monster of monsters){
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(MonsterAbilityScore)
                .values(monster.AbilityScores)
                .execute();
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(MonsterSavingThrow)
                .values(monster.SavingThrows)
                .execute();
        }

        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(Monster)
            .values(monsters)
            .execute();

        for (let monster of monsters){
            if (monster.Skills.length > 0){
                await queryRunner.manager
                    .createQueryBuilder()
                    .insert()
                    .into(MonsterSkill)
                    .values(monster.Skills)
                    .execute();
            }
            if (monster.Actions){
                if (monster.Actions.length > 0){
                    await queryRunner.manager
                        .createQueryBuilder()
                        .insert()
                        .into(Action)
                        .values(monster.Actions)
                        .execute();
                }
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        let monsters: Array<Monster> = []

        for (let index in Data){
            monsters.push(Data[index] as unknown as Monster);
        }

        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(Monster)
            .where(monsters)
            .execute();
    }
}