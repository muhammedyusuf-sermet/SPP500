import {MigrationInterface, QueryRunner} from "typeorm";
import { Encounter } from "../entity/Encounter";
import Data from './data/encounters.json';
import { Monster } from "../entity/Monster";

export class ParseEncounters2000000002000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let encounters: Array<Encounter> = []

        for (let index in Data){
            let encounter: Encounter = Data[index] as Encounter;
            encounter.Monsters = Data[index]["Monsters"] as Monster[];
            encounters.push(encounter);
            console.log(encounters[encounters.length - 1])
        }

        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(Encounter)
            .values(encounters)
            .execute();
        
        for (let index in encounters){
            await queryRunner.manager
                .createQueryBuilder()
                .relation(Encounter, "Monsters")
                .of(encounters[index])
                .add(encounters[index].Monsters)
        }
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