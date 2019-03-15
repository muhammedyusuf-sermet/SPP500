import {MigrationInterface, QueryRunner} from "typeorm";
import { AbilityScore } from "../entity/AbilityScore";
import { Skill } from "../entity/Skill";
import Data from './data/abilityScores.json';

export class ParseAbilityScores2000000002500 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let abilityScores: Array<AbilityScore> = Data.map(value => {
            const abilityScore: AbilityScore = Object.assign(new AbilityScore(),value);
            abilityScore.Skills = [];
            if (value.Skills != undefined) {
                for (let skl of value.Skills) {
                    const skill:Skill = Object.assign(new Skill(), skl);
                    skill.AbilityScore = abilityScore;
                    abilityScore.Skills.push(skill);
                }
            }
            return abilityScore;
        });

        //for (let index in Data){
            //abilityScores.push(Data[index] as AbilityScore);
        //}

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
            abilityScores.push(Data[index] as unknown as AbilityScore);
        }

        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(AbilityScore)
            .where(abilityScores)
            .execute();
    }
}
