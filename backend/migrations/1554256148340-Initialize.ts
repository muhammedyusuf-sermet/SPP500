import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1554256148340 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "monster" DROP CONSTRAINT "FK_6694bba3a49c923bc0bb5e7b7c6"`);
        await queryRunner.query(`ALTER TABLE "monster" DROP CONSTRAINT "FK_64f43c972688bda05f8b2a5a7a9"`);
        await queryRunner.query(`ALTER TABLE "monster" ADD CONSTRAINT "FK_6694bba3a49c923bc0bb5e7b7c6" FOREIGN KEY ("abilityScoresId") REFERENCES "monster_ability_score"("Id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monster" ADD CONSTRAINT "FK_64f43c972688bda05f8b2a5a7a9" FOREIGN KEY ("savingThrowsId") REFERENCES "monster_saving_throw"("Id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "monster" DROP CONSTRAINT "FK_64f43c972688bda05f8b2a5a7a9"`);
        await queryRunner.query(`ALTER TABLE "monster" DROP CONSTRAINT "FK_6694bba3a49c923bc0bb5e7b7c6"`);
        await queryRunner.query(`ALTER TABLE "monster" ADD CONSTRAINT "FK_64f43c972688bda05f8b2a5a7a9" FOREIGN KEY ("savingThrowsId") REFERENCES "monster_saving_throw"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monster" ADD CONSTRAINT "FK_6694bba3a49c923bc0bb5e7b7c6" FOREIGN KEY ("abilityScoresId") REFERENCES "monster_ability_score"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
