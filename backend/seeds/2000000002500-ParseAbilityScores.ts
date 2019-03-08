import {MigrationInterface, QueryRunner} from "typeorm";
import { AbilityScore } from "../entity/AbilityScore";
import Data from './data/abilityScores.json';

export class ParseAbilityScores2000000002500 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let abilityScores: Array<AbilityScore> = []

        for (let index in Data){
            abilityScores.push(Data[index] as AbilityScore);
        }

        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(AbilityScore)
            .values(abilityScores)
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        let abilityScores: Array<AbilityScore> = []

        for (let index in Data){
            abilityScores.push(Data[index] as AbilityScore);
        }

        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(AbilityScore)
            .where(abilityScores)
            .execute();
    }
}