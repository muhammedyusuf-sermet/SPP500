import {MigrationInterface, QueryRunner} from "typeorm";
import { Skill } from "../entity/Skill";
import { AbilityScore } from "../entity/AbilityScore";
import Data from './data/skills.json';

export class ParseSkills2000000001300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let skills: Array<Skill> = []

        const allAbilities: AbilityScore[] = await queryRunner.manager
            .createQueryBuilder(AbilityScore, "abilityScore") 
            .select("abilityScore")
            .getMany();

        const abilityScoreLookup: Map<string,AbilityScore> = new Map();
        allAbilities.forEach((value: AbilityScore) => {
            abilityScoreLookup.set(value.Abbreviation , value)
        });

        for (let index in Data){
            let skill: Skill = Object.assign(new Skill(), Data[index])
            const ability = abilityScoreLookup.get(skill.AbilityScore.Abbreviation)
            if (ability)
                skill.AbilityScore = ability
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
