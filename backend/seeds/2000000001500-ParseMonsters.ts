import {MigrationInterface, QueryRunner} from "typeorm";
import Data from './data/monsters.json';
import { Monster } from "../entity/Monster";
import { MonsterAbilityScore } from "../entity/MonsterAbilityScore";
import { MonsterSavingThrow } from "../entity/MonsterSavingThrow";
import { MonsterSkill } from "../entity/MonsterSkill";
import { Action } from "../entity/Action.js";
import { MonsterAction } from "../entity/MonsterEnums.js";

export class ParseMonsters2000000001500 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let monsters: Array<Monster> = []
        
        for (let index in Data){
            const jsonMonster: any = Data[index];
            const monster: Monster = jsonMonster as unknown as Monster;
            monster.AbilityScores = jsonMonster["AbilityScores"] as unknown as MonsterAbilityScore;
            monster.SavingThrows = jsonMonster["SavingThrows"] as unknown as MonsterSavingThrow;
            monster.Skills = jsonMonster["Skills"] as unknown as MonsterSkill[];
            monster.Actions = [];
            let temp: Action[];
            if(jsonMonster.hasOwnProperty("SpecialAbilities")){
                temp = jsonMonster["SpecialAbilities"] as unknown as Action[];
                for(var act of temp){
                    act.Type = MonsterAction.SpecialAbility;
                    monster.Actions.push(act);
                }
            }
            if(jsonMonster.hasOwnProperty("Actions")){
                temp = jsonMonster["Actions"] as unknown as Action[];
                for(var act of temp){
                    act.Type = MonsterAction.Action;
                    monster.Actions.push(act);
                }
            }
            if(jsonMonster.hasOwnProperty("LegendaryActions")){
                temp = jsonMonster["LegendaryActions"] as unknown as Action[];
                for(var act of temp){
                    act.Type = MonsterAction.LegendaryAction;
                    monster.Actions.push(act);
                }
            }
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(MonsterAbilityScore)
                .values(monster.AbilityScores)
                .insert()
                .into(MonsterSavingThrow)
                .values(monster.SavingThrows)
                .execute();
            monsters.push(monster);
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