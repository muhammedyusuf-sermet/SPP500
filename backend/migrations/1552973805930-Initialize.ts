import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1552973805930 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "sense" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Description" character varying(500) NOT NULL, CONSTRAINT "PK_a8cb216d9ebeb8e0af47f5884c8" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d789b42502ad68149019826bc9" ON "sense" ("Name") `);
        await queryRunner.query(`CREATE TABLE "monster_sense" ("Bonus" integer NOT NULL DEFAULT 0, "monsterId" integer NOT NULL, "senseId" integer NOT NULL, CONSTRAINT "PK_d2576ae9b879c103dc720d28050" PRIMARY KEY ("monsterId", "senseId"))`);
        await queryRunner.query(`ALTER TABLE "monster" DROP COLUMN "Senses"`);
        await queryRunner.query(`ALTER TABLE "monster_sense" ADD CONSTRAINT "FK_a85532ca7ee74ff5a2cdf7c9e00" FOREIGN KEY ("monsterId") REFERENCES "monster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monster_sense" ADD CONSTRAINT "FK_5af7b42d4783446827ec73e522b" FOREIGN KEY ("senseId") REFERENCES "sense"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "monster_sense" DROP CONSTRAINT "FK_5af7b42d4783446827ec73e522b"`);
        await queryRunner.query(`ALTER TABLE "monster_sense" DROP CONSTRAINT "FK_a85532ca7ee74ff5a2cdf7c9e00"`);
        await queryRunner.query(`ALTER TABLE "monster" ADD "Senses" character varying(250)`);
        await queryRunner.query(`DROP TABLE "monster_sense"`);
        await queryRunner.query(`DROP INDEX "IDX_d789b42502ad68149019826bc9"`);
        await queryRunner.query(`DROP TABLE "sense"`);
    }

}
