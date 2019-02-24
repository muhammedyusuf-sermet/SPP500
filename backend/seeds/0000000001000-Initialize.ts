import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize0000000001000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "monster_ability_score" ("Score" integer NOT NULL DEFAULT 1, "monsterId" integer NOT NULL, "abilityScoreId" integer NOT NULL, CONSTRAINT "PK_79666f47da7c12ec0dec0fa80ac" PRIMARY KEY ("monsterId", "abilityScoreId"))`);
        await queryRunner.query(`CREATE TABLE "monster_saving_throw" ("Bonus" integer NOT NULL DEFAULT 0, "monsterId" integer NOT NULL, "abilityScoreId" integer NOT NULL, CONSTRAINT "PK_b418fcdd0491aa9e225bead4852" PRIMARY KEY ("monsterId", "abilityScoreId"))`);
        await queryRunner.query(`CREATE TABLE "damage_type" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Description" character varying(500) NOT NULL, CONSTRAINT "PK_0779514820f8c5085f051d14354" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_08f347e3809c385debbc61ae06" ON "damage_type" ("Name") `);
        await queryRunner.query(`CREATE TYPE "monster_damage_type_resistance_type_enum" AS ENUM('Vulnerable', 'Resistance', 'Immunit')`);
        await queryRunner.query(`CREATE TABLE "monster_damage_type_resistance" ("Type" "monster_damage_type_resistance_type_enum" NOT NULL DEFAULT 'Resistance', "monsterId" integer NOT NULL, "damageTypeId" integer NOT NULL, CONSTRAINT "PK_fd06609e974989516e5a15fe471" PRIMARY KEY ("monsterId", "damageTypeId"))`);
        await queryRunner.query(`CREATE TABLE "condition" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Description" character varying(500) NOT NULL, CONSTRAINT "PK_17377b2f6284a7b5c8307175d10" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5d3cdb262994be345bd41a22be" ON "condition" ("Name") `);
        await queryRunner.query(`CREATE TYPE "monster_size_enum" AS ENUM('Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan')`);
        await queryRunner.query(`CREATE TYPE "monster_type_enum" AS ENUM('Beast', 'Dragon', 'Monstrosity', 'Humanoid', 'Fiend', 'Undead', 'Giant', 'Elemental', 'SwarmOfTinyBeasts', 'Construct', 'Celestial', 'Aberration', 'Fey', 'Plant', 'Ooze')`);
        await queryRunner.query(`CREATE TYPE "monster_race_enum" AS ENUM('AnyRace', 'Devil', 'Demon', 'Human', 'Shapechanger', 'Goblinoid', 'Titan', 'Gnoll', 'Gnome', 'Dwarf', 'Elf', 'Orc', 'Kobold', 'Lizardfolk', 'Merfolk', 'Sahuagin', 'Grimlock')`);
        await queryRunner.query(`CREATE TYPE "monster_alignment_enum" AS ENUM('Unaligned', 'AnyAlignment', 'LawfulDood', 'LawfulNeutral', 'LawfulEvil', 'NeutralGood', 'Neutral', 'NeutralEvil', 'ChaoticGood', 'ChaoticNeutral', 'ChaoticEvil')`);
        await queryRunner.query(`CREATE TABLE "monster" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Size" "monster_size_enum" NOT NULL DEFAULT 'Medium', "Type" "monster_type_enum" NOT NULL DEFAULT 'Beast', "Race" "monster_race_enum" NOT NULL DEFAULT 'AnyRace', "Alignment" "monster_alignment_enum" NOT NULL DEFAULT 'Unaligned', "ArmorClass" integer NOT NULL DEFAULT 12, "HitPoints" integer NOT NULL DEFAULT 12, "Damage" character varying(20) NOT NULL DEFAULT '2d8', "Speed" character varying(100) NOT NULL DEFAULT '30 ft.', "Senses" character varying(100), "Languages" character varying(100), "ChallengeRating" integer NOT NULL DEFAULT 1, CONSTRAINT "PK_71262e4809a6a57c2884adc602a" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8ccf480a825d66b4d68c1b0c1d" ON "monster" ("Name") `);
        await queryRunner.query(`CREATE TABLE "monster_skill" ("Bonus" integer NOT NULL DEFAULT 0, "monsterId" integer NOT NULL, "skillId" integer NOT NULL, CONSTRAINT "PK_f7ccbbdfbb7d63435fb29a4f972" PRIMARY KEY ("monsterId", "skillId"))`);
        await queryRunner.query(`CREATE TABLE "skill" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Description" character varying(500) NOT NULL, "abilityScoreId" integer, CONSTRAINT "PK_b07b45d0afe62341ae6694c92de" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7d53475023496ce46286fd9973" ON "skill" ("Name") `);
        await queryRunner.query(`CREATE TABLE "ability_score" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Abbreviation" character varying(3) NOT NULL, "Description" character varying(500) NOT NULL, CONSTRAINT "PK_e1ad9f97ceba04146f0258b30bb" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_65738434cd3fba30f023829845" ON "ability_score" ("Name") `);
        await queryRunner.query(`CREATE TYPE "spell_components_enum" AS ENUM('Verbal', 'Somatic', 'Material')`);
        await queryRunner.query(`CREATE TABLE "spell" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Level" integer NOT NULL DEFAULT 1, "CastingTime" character varying(50) NOT NULL DEFAULT '1 action', "Range" character varying(50) NOT NULL DEFAULT '60 feet', "Components" "spell_components_enum" array NOT NULL, "Material" character varying(250) NOT NULL, "Duration" character varying(50) NOT NULL, "Description" text array NOT NULL, "HigherLevel" text NOT NULL, "School" character varying(50) NOT NULL, CONSTRAINT "PK_49280a9177bd99233f4cebcac09" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ee43e68e19ab37286968f0b675" ON "spell" ("Name") `);
        await queryRunner.query(`CREATE TABLE "user" ("Id" SERIAL NOT NULL, "Email" character varying NOT NULL, "Username" character varying NOT NULL, "Name" character varying NOT NULL, "HashedPassword" character varying NOT NULL, "Type" character varying NOT NULL, CONSTRAINT "UQ_b7eee57d84fb7ed872e660197fb" UNIQUE ("Email"), CONSTRAINT "UQ_b000857089edf6cae23b9bc9b8e" UNIQUE ("Username"), CONSTRAINT "PK_1e4be10b13490bd87f4cc30c142" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "monster__condition_immunity_condition" ("monsterId" integer NOT NULL, "conditionId" integer NOT NULL, CONSTRAINT "PK_b8154d0c4b5e430d279725890bd" PRIMARY KEY ("monsterId", "conditionId"))`);
        await queryRunner.query(`ALTER TABLE "monster_ability_score" ADD CONSTRAINT "FK_6bc4b38c264c915f03e27914e91" FOREIGN KEY ("monsterId") REFERENCES "monster"("Id")`);
        await queryRunner.query(`ALTER TABLE "monster_ability_score" ADD CONSTRAINT "FK_a231d3ba7034e3adb595156f01f" FOREIGN KEY ("abilityScoreId") REFERENCES "ability_score"("Id")`);
        await queryRunner.query(`ALTER TABLE "monster_saving_throw" ADD CONSTRAINT "FK_288ff8920ab04d645b282ea5445" FOREIGN KEY ("monsterId") REFERENCES "monster"("Id")`);
        await queryRunner.query(`ALTER TABLE "monster_saving_throw" ADD CONSTRAINT "FK_31b04a38f944f86de5c2964dbaa" FOREIGN KEY ("abilityScoreId") REFERENCES "ability_score"("Id")`);
        await queryRunner.query(`ALTER TABLE "monster_damage_type_resistance" ADD CONSTRAINT "FK_7098a9847de4c1055f9e6272786" FOREIGN KEY ("monsterId") REFERENCES "monster"("Id")`);
        await queryRunner.query(`ALTER TABLE "monster_damage_type_resistance" ADD CONSTRAINT "FK_c826e26645519d8f80c175a1d2c" FOREIGN KEY ("damageTypeId") REFERENCES "damage_type"("Id")`);
        await queryRunner.query(`ALTER TABLE "monster_skill" ADD CONSTRAINT "FK_5d5ca80f8dded0badd10a2d63a3" FOREIGN KEY ("monsterId") REFERENCES "monster"("Id")`);
        await queryRunner.query(`ALTER TABLE "monster_skill" ADD CONSTRAINT "FK_f38d7151df60036af444e8438a8" FOREIGN KEY ("skillId") REFERENCES "skill"("Id")`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_d98e3ad210474047014a94d6f4b" FOREIGN KEY ("abilityScoreId") REFERENCES "ability_score"("Id")`);
        await queryRunner.query(`ALTER TABLE "monster__condition_immunity_condition" ADD CONSTRAINT "FK_35c97cfc116b9c992aa94ac09c8" FOREIGN KEY ("monsterId") REFERENCES "monster"("Id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "monster__condition_immunity_condition" ADD CONSTRAINT "FK_9d05327c2de15b5a4cb5618d50a" FOREIGN KEY ("conditionId") REFERENCES "condition"("Id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "monster__condition_immunity_condition" DROP CONSTRAINT "FK_9d05327c2de15b5a4cb5618d50a"`);
        await queryRunner.query(`ALTER TABLE "monster__condition_immunity_condition" DROP CONSTRAINT "FK_35c97cfc116b9c992aa94ac09c8"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_d98e3ad210474047014a94d6f4b"`);
        await queryRunner.query(`ALTER TABLE "monster_skill" DROP CONSTRAINT "FK_f38d7151df60036af444e8438a8"`);
        await queryRunner.query(`ALTER TABLE "monster_skill" DROP CONSTRAINT "FK_5d5ca80f8dded0badd10a2d63a3"`);
        await queryRunner.query(`ALTER TABLE "monster_damage_type_resistance" DROP CONSTRAINT "FK_c826e26645519d8f80c175a1d2c"`);
        await queryRunner.query(`ALTER TABLE "monster_damage_type_resistance" DROP CONSTRAINT "FK_7098a9847de4c1055f9e6272786"`);
        await queryRunner.query(`ALTER TABLE "monster_saving_throw" DROP CONSTRAINT "FK_31b04a38f944f86de5c2964dbaa"`);
        await queryRunner.query(`ALTER TABLE "monster_saving_throw" DROP CONSTRAINT "FK_288ff8920ab04d645b282ea5445"`);
        await queryRunner.query(`ALTER TABLE "monster_ability_score" DROP CONSTRAINT "FK_a231d3ba7034e3adb595156f01f"`);
        await queryRunner.query(`ALTER TABLE "monster_ability_score" DROP CONSTRAINT "FK_6bc4b38c264c915f03e27914e91"`);
        await queryRunner.query(`DROP TABLE "monster__condition_immunity_condition"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "IDX_ee43e68e19ab37286968f0b675"`);
        await queryRunner.query(`DROP TABLE "spell"`);
        await queryRunner.query(`DROP TYPE "spell_components_enum"`);
        await queryRunner.query(`DROP INDEX "IDX_65738434cd3fba30f023829845"`);
        await queryRunner.query(`DROP TABLE "ability_score"`);
        await queryRunner.query(`DROP INDEX "IDX_7d53475023496ce46286fd9973"`);
        await queryRunner.query(`DROP TABLE "skill"`);
        await queryRunner.query(`DROP TABLE "monster_skill"`);
        await queryRunner.query(`DROP INDEX "IDX_8ccf480a825d66b4d68c1b0c1d"`);
        await queryRunner.query(`DROP TABLE "monster"`);
        await queryRunner.query(`DROP TYPE "monster_alignment_enum"`);
        await queryRunner.query(`DROP TYPE "monster_race_enum"`);
        await queryRunner.query(`DROP TYPE "monster_type_enum"`);
        await queryRunner.query(`DROP TYPE "monster_size_enum"`);
        await queryRunner.query(`DROP INDEX "IDX_5d3cdb262994be345bd41a22be"`);
        await queryRunner.query(`DROP TABLE "condition"`);
        await queryRunner.query(`DROP TABLE "monster_damage_type_resistance"`);
        await queryRunner.query(`DROP TYPE "monster_damage_type_resistance_type_enum"`);
        await queryRunner.query(`DROP INDEX "IDX_08f347e3809c385debbc61ae06"`);
        await queryRunner.query(`DROP TABLE "damage_type"`);
        await queryRunner.query(`DROP TABLE "monster_saving_throw"`);
        await queryRunner.query(`DROP TABLE "monster_ability_score"`);
    }

}
