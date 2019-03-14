import {MigrationInterface, QueryRunner} from "typeorm";
import { Skill } from "../entity/Skill";
import Data from './data/skills.json';

export class ParseSkills2000000003000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let skills: Array<Skill> = []

        for (let index in Data){
            skills.push(Data[index] as Skill);
        }

        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(Skill)
            .values(skills)
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        let skills: Array<Skill> = []

        for (let index in Data){
            skills.push(Data[index] as unknown as Skill);
        }

        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(Skill)
            .where(skills)
            .execute();
    }
}
