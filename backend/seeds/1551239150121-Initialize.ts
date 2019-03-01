import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1551239150121 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "monster_ability_score" ("Id" SERIAL NOT NULL, "Strength" integer NOT NULL DEFAULT 1, "Dexterity" integer NOT NULL DEFAULT 1, "Constitution" integer NOT NULL DEFAULT 1, "Intelligence" integer NOT NULL DEFAULT 1, "Wisdom" integer NOT NULL DEFAULT 1, "Charisma" integer NOT NULL DEFAULT 1, CONSTRAINT "PK_01d347e5e11ab4e229758ea4101" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "monster_saving_throw" ("Id" SERIAL NOT NULL, "Strength" integer NOT NULL DEFAULT 0, "Dexterity" integer NOT NULL DEFAULT 0, "Constitution" integer NOT NULL DEFAULT 0, "Intelligence" integer NOT NULL DEFAULT 0, "Wisdom" integer NOT NULL DEFAULT 0, "Charisma" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_0a0488ae26076022cc483cd3f41" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("Id" SERIAL NOT NULL, "Email" character varying NOT NULL, "Username" character varying NOT NULL, "Name" character varying NOT NULL, "HashedPassword" character varying NOT NULL, "Type" character varying NOT NULL, CONSTRAINT "UQ_b7eee57d84fb7ed872e660197fb" UNIQUE ("Email"), CONSTRAINT "UQ_b000857089edf6cae23b9bc9b8e" UNIQUE ("Username"), CONSTRAINT "PK_1e4be10b13490bd87f4cc30c142" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "encounter" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Description" character varying(1000) NOT NULL, "creatorId" integer, CONSTRAINT "PK_c754ade895137904bc19eaca5f7" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TYPE "monster_size_enum" AS ENUM('Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan')`);
        await queryRunner.query(`CREATE TYPE "monster_type_enum" AS ENUM('Beast', 'Dragon', 'Monstrosity', 'Humanoid', 'Fiend', 'Undead', 'Giant', 'Elemental', 'SwarmOfTinyBeasts', 'Construct', 'Celestial', 'Aberration', 'Fey', 'Plant', 'Ooze')`);
        await queryRunner.query(`CREATE TYPE "monster_race_enum" AS ENUM('AnyRace', 'Devil', 'Demon', 'Human', 'Shapechanger', 'Goblinoid', 'Titan', 'Gnoll', 'Gnome', 'Dwarf', 'Elf', 'Orc', 'Kobold', 'Lizardfolk', 'Merfolk', 'Sahuagin', 'Grimlock')`);
        await queryRunner.query(`CREATE TYPE "monster_alignment_enum" AS ENUM('Unaligned', 'AnyAlignment', 'AnyNonGoodAlignment', 'AnyNonEvilAlignment', 'AnyNonLawfulAlignment', 'AnyNonChaoticAlignment', 'AnyGoodAlignment', 'AnyEvilAlignment', 'AnyLawfulAlignment', 'AnyChaoticAlignment', 'AnyNeutralAlignment', 'LawfulGood', 'LawfulNeutral', 'LawfulEvil', 'NeutralGood', 'Neutral', 'NeutralEvil', 'ChaoticGood', 'ChaoticNeutral', 'ChaoticEvil')`);
        await queryRunner.query(`CREATE TABLE "monster" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Size" "monster_size_enum" NOT NULL DEFAULT 'Medium', "Type" "monster_type_enum" NOT NULL DEFAULT 'Beast', "Race" "monster_race_enum" NOT NULL DEFAULT 'AnyRace', "Alignment" "monster_alignment_enum" NOT NULL DEFAULT 'Unaligned', "ArmorClass" integer NOT NULL DEFAULT 12, "HitPoints" integer NOT NULL DEFAULT 12, "Damage" character varying(20) NOT NULL DEFAULT '2d8', "Speed" character varying(100) NOT NULL DEFAULT '30 ft.', "Senses" character varying(100), "Languages" character varying(100), "DamageVulnerabilities" character varying(200), "DamageResistances" character varying(200), "DamageImmunities" character varying(200), "ConditionImmunities" character varying(200), "ChallengeRating" double precision NOT NULL DEFAULT 1, "abilityScoresId" integer, "savingThrowsId" integer, CONSTRAINT "REL_6694bba3a49c923bc0bb5e7b7c" UNIQUE ("abilityScoresId"), CONSTRAINT "REL_64f43c972688bda05f8b2a5a7a" UNIQUE ("savingThrowsId"), CONSTRAINT "PK_71262e4809a6a57c2884adc602a" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8ccf480a825d66b4d68c1b0c1d" ON "monster" ("Name") `);
        await queryRunner.query(`CREATE TABLE "monster_skill" ("Bonus" integer NOT NULL DEFAULT 0, "monsterId" integer NOT NULL, "skillId" integer NOT NULL, CONSTRAINT "PK_f7ccbbdfbb7d63435fb29a4f972" PRIMARY KEY ("monsterId", "skillId"))`);
        await queryRunner.query(`CREATE TABLE "skill" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Description" character varying(500) NOT NULL, "abilityScoreId" integer, CONSTRAINT "PK_b07b45d0afe62341ae6694c92de" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7d53475023496ce46286fd9973" ON "skill" ("Name") `);
        await queryRunner.query(`CREATE TABLE "ability_score" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Abbreviation" character varying(3) NOT NULL, "Description" character varying(500) NOT NULL, CONSTRAINT "PK_e1ad9f97ceba04146f0258b30bb" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_65738434cd3fba30f023829845" ON "ability_score" ("Name") `);
        await queryRunner.query(`CREATE TABLE "condition" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Description" character varying(500) NOT NULL, CONSTRAINT "PK_17377b2f6284a7b5c8307175d10" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5d3cdb262994be345bd41a22be" ON "condition" ("Name") `);
        await queryRunner.query(`CREATE TABLE "damage_type" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Description" character varying(500) NOT NULL, CONSTRAINT "PK_0779514820f8c5085f051d14354" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_08f347e3809c385debbc61ae06" ON "damage_type" ("Name") `);
        await queryRunner.query(`CREATE TYPE "spell_components_enum" AS ENUM('Verbal', 'Somatic', 'Material')`);
        await queryRunner.query(`CREATE TABLE "spell" ("Id" SERIAL NOT NULL, "Name" character varying(50) NOT NULL, "Level" integer NOT NULL DEFAULT 1, "CastingTime" character varying(50) NOT NULL DEFAULT '1 action', "Range" character varying(50) NOT NULL DEFAULT '60 feet', "Components" "spell_components_enum" array NOT NULL, "Material" character varying(250) NOT NULL, "Duration" character varying(50) NOT NULL, "Description" text array NOT NULL, "HigherLevel" text NOT NULL, "School" character varying(50) NOT NULL, CONSTRAINT "PK_49280a9177bd99233f4cebcac09" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ee43e68e19ab37286968f0b675" ON "spell" ("Name") `);
        await queryRunner.query(`CREATE TABLE "encounter__monsters_monster" ("encounterId" integer NOT NULL, "monsterId" integer NOT NULL, CONSTRAINT "PK_157e524d8a5f118f5c51c8aeeec" PRIMARY KEY ("encounterId", "monsterId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ec380976d6856e2c0258d9c663" ON "encounter__monsters_monster" ("encounterId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a964516b4fd4dbd222d24b031d" ON "encounter__monsters_monster" ("monsterId") `);
        await queryRunner.query(`ALTER TABLE "encounter" ADD CONSTRAINT "FK_1e0f1d64c0c913509e260c741c4" FOREIGN KEY ("creatorId") REFERENCES "user"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monster" ADD CONSTRAINT "FK_6694bba3a49c923bc0bb5e7b7c6" FOREIGN KEY ("abilityScoresId") REFERENCES "monster_ability_score"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monster" ADD CONSTRAINT "FK_64f43c972688bda05f8b2a5a7a9" FOREIGN KEY ("savingThrowsId") REFERENCES "monster_saving_throw"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monster_skill" ADD CONSTRAINT "FK_5d5ca80f8dded0badd10a2d63a3" FOREIGN KEY ("monsterId") REFERENCES "monster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monster_skill" ADD CONSTRAINT "FK_f38d7151df60036af444e8438a8" FOREIGN KEY ("skillId") REFERENCES "skill"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_d98e3ad210474047014a94d6f4b" FOREIGN KEY ("abilityScoreId") REFERENCES "ability_score"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "encounter__monsters_monster" ADD CONSTRAINT "FK_ec380976d6856e2c0258d9c663a" FOREIGN KEY ("encounterId") REFERENCES "encounter"("Id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "encounter__monsters_monster" ADD CONSTRAINT "FK_a964516b4fd4dbd222d24b031db" FOREIGN KEY ("monsterId") REFERENCES "monster"("Id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "encounter__monsters_monster" DROP CONSTRAINT "FK_a964516b4fd4dbd222d24b031db"`);
        await queryRunner.query(`ALTER TABLE "encounter__monsters_monster" DROP CONSTRAINT "FK_ec380976d6856e2c0258d9c663a"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_d98e3ad210474047014a94d6f4b"`);
        await queryRunner.query(`ALTER TABLE "monster_skill" DROP CONSTRAINT "FK_f38d7151df60036af444e8438a8"`);
        await queryRunner.query(`ALTER TABLE "monster_skill" DROP CONSTRAINT "FK_5d5ca80f8dded0badd10a2d63a3"`);
        await queryRunner.query(`ALTER TABLE "monster" DROP CONSTRAINT "FK_64f43c972688bda05f8b2a5a7a9"`);
        await queryRunner.query(`ALTER TABLE "monster" DROP CONSTRAINT "FK_6694bba3a49c923bc0bb5e7b7c6"`);
        await queryRunner.query(`ALTER TABLE "encounter" DROP CONSTRAINT "FK_1e0f1d64c0c913509e260c741c4"`);
        await queryRunner.query(`DROP INDEX "IDX_a964516b4fd4dbd222d24b031d"`);
        await queryRunner.query(`DROP INDEX "IDX_ec380976d6856e2c0258d9c663"`);
        await queryRunner.query(`DROP TABLE "encounter__monsters_monster"`);
        await queryRunner.query(`DROP INDEX "IDX_ee43e68e19ab37286968f0b675"`);
        await queryRunner.query(`DROP TABLE "spell"`);
        await queryRunner.query(`DROP TYPE "spell_components_enum"`);
        await queryRunner.query(`DROP INDEX "IDX_08f347e3809c385debbc61ae06"`);
        await queryRunner.query(`DROP TABLE "damage_type"`);
        await queryRunner.query(`DROP INDEX "IDX_5d3cdb262994be345bd41a22be"`);
        await queryRunner.query(`DROP TABLE "condition"`);
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
        await queryRunner.query(`DROP TABLE "encounter"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "monster_saving_throw"`);
        await queryRunner.query(`DROP TABLE "monster_ability_score"`);
    }

}
