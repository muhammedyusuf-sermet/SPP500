import {MigrationInterface, QueryRunner} from "typeorm";
import { Sense } from "../entity/Sense";
import Data from './data/senses.json';

export class ParseSenses2000000001350 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let senses: Array<Sense> = [];

        for (let index in Data){
            let sense: Sense = Object.assign(new Sense(), Data[index])
            senses.push(sense);
        }

        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(Sense)
            .values(senses)
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        let senses: Array<Sense> = []

        for (let index in Data){
            senses.push(Data[index] as unknown as Sense);
        }

        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(Sense)
            .where(senses)
            .execute();
    }
}
