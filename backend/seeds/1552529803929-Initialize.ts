import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1552529803929 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "campaign" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Summary" character varying(1000) NOT NULL, "Notes" character varying(2000) NOT NULL, "creatorId" integer, CONSTRAINT "PK_ec02c021fe2bb7a5b837b21e757" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "campaign__encounters_encounter" ("campaignId" integer NOT NULL, "encounterId" integer NOT NULL, CONSTRAINT "PK_8c9005cbb88ad95f6b6ef1a14f9" PRIMARY KEY ("campaignId", "encounterId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_20cf01302aea1428da0e7c1607" ON "campaign__encounters_encounter" ("campaignId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cf89789aa6a22529529b3d52b9" ON "campaign__encounters_encounter" ("encounterId") `);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "FK_c38d4849426070e19e4ce37f3cf" FOREIGN KEY ("creatorId") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign__encounters_encounter" ADD CONSTRAINT "FK_20cf01302aea1428da0e7c16076" FOREIGN KEY ("campaignId") REFERENCES "campaign"("Id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign__encounters_encounter" ADD CONSTRAINT "FK_cf89789aa6a22529529b3d52b99" FOREIGN KEY ("encounterId") REFERENCES "encounter"("Id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "campaign__encounters_encounter" DROP CONSTRAINT "FK_cf89789aa6a22529529b3d52b99"`);
        await queryRunner.query(`ALTER TABLE "campaign__encounters_encounter" DROP CONSTRAINT "FK_20cf01302aea1428da0e7c16076"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "FK_c38d4849426070e19e4ce37f3cf"`);
        await queryRunner.query(`DROP INDEX "IDX_cf89789aa6a22529529b3d52b9"`);
        await queryRunner.query(`DROP INDEX "IDX_20cf01302aea1428da0e7c1607"`);
        await queryRunner.query(`DROP TABLE "campaign__encounters_encounter"`);
        await queryRunner.query(`DROP TABLE "campaign"`);
    }

}
