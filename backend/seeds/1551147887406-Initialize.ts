import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1551147887406 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "encounter" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Description" character varying(1000) NOT NULL, "creatorId" integer, CONSTRAINT "PK_c754ade895137904bc19eaca5f7" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7ee94c4c72fc31071ca981b58e" ON "encounter" ("Name") `);
        await queryRunner.query(`CREATE TABLE "encounter__monsters_monster" ("encounterId" integer NOT NULL, "monsterId" integer NOT NULL, CONSTRAINT "PK_157e524d8a5f118f5c51c8aeeec" PRIMARY KEY ("encounterId", "monsterId"))`);
        await queryRunner.query(`CREATE TABLE "monster__encounters_encounter" ("monsterId" integer NOT NULL, "encounterId" integer NOT NULL, CONSTRAINT "PK_e3a9dddbe8dacdf8c586f638472" PRIMARY KEY ("monsterId", "encounterId"))`);
        await queryRunner.query(`ALTER TABLE "encounter" ADD CONSTRAINT "FK_1e0f1d64c0c913509e260c741c4" FOREIGN KEY ("creatorId") REFERENCES "user"("Id")`);
        await queryRunner.query(`ALTER TABLE "encounter__monsters_monster" ADD CONSTRAINT "FK_ec380976d6856e2c0258d9c663a" FOREIGN KEY ("encounterId") REFERENCES "encounter"("Id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "encounter__monsters_monster" ADD CONSTRAINT "FK_a964516b4fd4dbd222d24b031db" FOREIGN KEY ("monsterId") REFERENCES "monster"("Id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "monster__encounters_encounter" ADD CONSTRAINT "FK_194ce89bce9f3d58c59d075455e" FOREIGN KEY ("monsterId") REFERENCES "monster"("Id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "monster__encounters_encounter" ADD CONSTRAINT "FK_c8eedb1e0cd2546262085d0f95d" FOREIGN KEY ("encounterId") REFERENCES "encounter"("Id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "monster__encounters_encounter" DROP CONSTRAINT "FK_c8eedb1e0cd2546262085d0f95d"`);
        await queryRunner.query(`ALTER TABLE "monster__encounters_encounter" DROP CONSTRAINT "FK_194ce89bce9f3d58c59d075455e"`);
        await queryRunner.query(`ALTER TABLE "encounter__monsters_monster" DROP CONSTRAINT "FK_a964516b4fd4dbd222d24b031db"`);
        await queryRunner.query(`ALTER TABLE "encounter__monsters_monster" DROP CONSTRAINT "FK_ec380976d6856e2c0258d9c663a"`);
        await queryRunner.query(`ALTER TABLE "encounter" DROP CONSTRAINT "FK_1e0f1d64c0c913509e260c741c4"`);
        await queryRunner.query(`DROP TABLE "monster__encounters_encounter"`);
        await queryRunner.query(`DROP TABLE "encounter__monsters_monster"`);
        await queryRunner.query(`DROP INDEX "IDX_7ee94c4c72fc31071ca981b58e"`);
        await queryRunner.query(`DROP TABLE "encounter"`);
    }

}
