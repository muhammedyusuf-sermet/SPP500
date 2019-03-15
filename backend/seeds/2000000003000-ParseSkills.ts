import {MigrationInterface, QueryRunner} from "typeorm";
import { Skill } from "../entity/Skill";
import { AbilityScore } from "../entity/AbilityScore";
import Data from './data/skills.json';

export class ParseSkills2000000003000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let skills: Array<Skill> = []

        const allAbilities: AbilityScore[] = await AbilityScore.find({ select: ["Id", "Abbreviation"] });
        const abilityScoreLookup: { [Name: string]: AbilityScore }= {};
        allAbilities.forEach((value) => {
        abilityScoreLookup[value.Abbreviation] = value;
        });

        for (let index in Data){
            let skill: Skill = Data[index] as unknown as Skill
            skill.AbilityScore = abilityScoreLookup[skill.AbilityScore.Abbreviation]
            skills.push(skill);
        }

        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(Skill)
            .values(skills)
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        let skills: Array<Skill> = []

        for (let index in Data){
            skills.push(Data[index] as unknown as Skill);
        }

        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(Skill)
            .where(skills)
            .execute();
    }
}
