import {MigrationInterface, QueryRunner} from "typeorm";
import { Encounter } from "../entity/Encounter";
import Data from './data/encounters.json';

export class ParseEncounters1551147888000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let encounters: Array<Encounter> = []

        for (let index in Data){
            encounters.push(Data[index] as unknown as Encounter);
            console.log(encounters[encounters.length - 1])
        }

        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(Encounter)
            .values(encounters)
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        let encounters: Array<Encounter> = []

        for (let index in Data){
            encounters.push(Data[index] as unknown as Encounter);
        }

        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(Encounter)
            .where(encounters)
            .execute();
    }
}