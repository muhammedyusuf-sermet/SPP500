import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1555797020238 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "character_race_enum" AS ENUM('Dragonborn', 'Dwarf', 'Elf', 'Gnome', 'HalfElf', 'Halfling', 'HalfOrc', 'Human', 'Tiefling')`);
        await queryRunner.query(`CREATE TYPE "character_class_enum" AS ENUM('Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard')`);
        await queryRunner.query(`CREATE TABLE "character" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Level" integer NOT NULL DEFAULT 1, "Race" "character_race_enum" NOT NULL DEFAULT 'Human', "Class" "character_class_enum" NOT NULL DEFAULT 'Fighter', "MaxHealth" integer NOT NULL DEFAULT 20, "ArmorClass" integer NOT NULL DEFAULT 12, "Notes" character varying(1000) NOT NULL, "creatorId" integer, CONSTRAINT "PK_d97b91f53abe575b78784228a22" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e7513f186b0ba109bcca0fa8e7" ON "character" ("Name") `);
        await queryRunner.query(`CREATE TABLE "campaign__characters_character" ("campaignId" integer NOT NULL, "characterId" integer NOT NULL, CONSTRAINT "PK_eece0cf05fd502fad5680dfb4b6" PRIMARY KEY ("campaignId", "characterId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a460389b35bb6b80968bddb548" ON "campaign__characters_character" ("campaignId") `);
        await queryRunner.query(`CREATE INDEX "IDX_90c7b345626c8a67678d78f4b6" ON "campaign__characters_character" ("characterId") `);
        await queryRunner.query(`ALTER TABLE "character" ADD CONSTRAINT "FK_3228781adcd87f1ee1d743a298b" FOREIGN KEY ("creatorId") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign__characters_character" ADD CONSTRAINT "FK_a460389b35bb6b80968bddb548d" FOREIGN KEY ("campaignId") REFERENCES "campaign"("Id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign__characters_character" ADD CONSTRAINT "FK_90c7b345626c8a67678d78f4b69" FOREIGN KEY ("characterId") REFERENCES "character"("Id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "campaign__characters_character" DROP CONSTRAINT "FK_90c7b345626c8a67678d78f4b69"`);
        await queryRunner.query(`ALTER TABLE "campaign__characters_character" DROP CONSTRAINT "FK_a460389b35bb6b80968bddb548d"`);
        await queryRunner.query(`ALTER TABLE "character" DROP CONSTRAINT "FK_3228781adcd87f1ee1d743a298b"`);
        await queryRunner.query(`DROP INDEX "IDX_90c7b345626c8a67678d78f4b6"`);
        await queryRunner.query(`DROP INDEX "IDX_a460389b35bb6b80968bddb548"`);
        await queryRunner.query(`DROP TABLE "campaign__characters_character"`);
        await queryRunner.query(`DROP INDEX "IDX_e7513f186b0ba109bcca0fa8e7"`);
        await queryRunner.query(`DROP TABLE "character"`);
        await queryRunner.query(`DROP TYPE "character_class_enum"`);
        await queryRunner.query(`DROP TYPE "character_race_enum"`);
    }

}
