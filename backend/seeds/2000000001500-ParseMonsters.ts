import {MigrationInterface, QueryRunner} from "typeorm";
import Data from './data/monsters.json';
import { Monster } from "../entity/Monster";
import { MonsterAbilityScore } from "../entity/MonsterAbilityScore";
import { MonsterSavingThrow } from "../entity/MonsterSavingThrow";
import { MonsterSkill } from "../entity/MonsterSkill";

export class ParseMonsters2000000001500 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let monsters: Array<Monster> = []
        
        for (let index in Data){
            const monster: Monster = Data[index] as Monster;
            monster.AbilityScores = Data[index]["AbilityScores"] as unknown as MonsterAbilityScore;
            monster.SavingThrows = Data[index]["SavingThrows"] as unknown as MonsterSavingThrow;
            monster.Skills = Data[index]["Skills"] as unknown as MonsterSkill[];
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
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        let monsters: Array<Monster> = []

        for (let index in Data){
            monsters.push(Data[index] as Monster);
        }

        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(Monster)
            .where(monsters)
            .execute();
    }
}