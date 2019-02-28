import {MigrationInterface, QueryRunner} from "typeorm";
import { User } from "../entity/User";
import Data from './data/users.json';

export class ParseUsers2000000001000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let users: Array<User> = []

        for (let index in Data){
            users.push(Data[index] as User);
        }

        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(users)
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        let users: Array<User> = []

        for (let index in Data){
            users.push(Data[index] as User);
        }

        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(User)
            .where(users)
            .execute();
    }
}