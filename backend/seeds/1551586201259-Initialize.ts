import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1551589093229 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "action_type_enum" AS ENUM('SpecialAbility', 'Action', 'LegendaryAction')`);
        await queryRunner.query(`CREATE TABLE "action" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Description" character varying(250) NOT NULL, "HitBonus" integer NOT NULL DEFAULT 0, "Damage" character varying(20), "DamageBonus" integer NOT NULL DEFAULT 0, "Type" "action_type_enum" NOT NULL DEFAULT 'Action', CONSTRAINT "PK_5af3afdfef0cbd9261cbea8e601" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_db0d4942d92bfaaf411324304d" ON "action" ("Name") `);
        await queryRunner.query(`CREATE TYPE "monster_environment_enum" AS ENUM('Arctic', 'Coastal', 'Desert', 'Forest', 'Grassland', 'Hill', 'Mountain', 'Swamp', 'Underdark', 'Underwater', 'Urban')`);
        await queryRunner.query(`ALTER TABLE "monster" ADD "Environment" "monster_environment_enum" NOT NULL DEFAULT 'Grassland'`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "monster" DROP COLUMN "Environment"`);
        await queryRunner.query(`DROP TYPE "monster_environment_enum"`);
        await queryRunner.query(`DROP INDEX "IDX_db0d4942d92bfaaf411324304d"`);
        await queryRunner.query(`DROP TABLE "action"`);
        await queryRunner.query(`DROP TYPE "action_type_enum"`);
    }

}
