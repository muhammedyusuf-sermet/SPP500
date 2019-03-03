import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1551586201259 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "monster_environment_enum" AS ENUM('Arctic', 'Coastal', 'Desert', 'Forest', 'Grassland', 'Hill', 'Mountain', 'Swamp', 'Underdark', 'Underwater', 'Urban')`);
        await queryRunner.query(`ALTER TABLE "monster" ADD "Environment" "monster_environment_enum" NOT NULL DEFAULT 'Grassland'`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "monster" DROP COLUMN "Environment"`);
        await queryRunner.query(`DROP TYPE "monster_environment_enum"`);
    }

}
