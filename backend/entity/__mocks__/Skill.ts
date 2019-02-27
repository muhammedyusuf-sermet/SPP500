import { AbilityScore } from "./AbilityScore";

export class Skill {
	Id: number;
	AbilityScore: AbilityScore;
	Name: string;
	Description: string;
	[key: string]: string|AbilityScore|number|(()=>void);

	static TableRows: Skill[] = [];

	static find(a: any) {
		var result = Skill.TableRows.slice(0);
		for (let key in a) {
			let value = a[key];
			result = result.filter(function (el: Skill) {
				return el[key] == value;
			});
		}

		return result
	}

	static findOne(a: any) {
		return this.find(a)[0]
	}

	save() {
		Skill.TableRows.push(this)
	}
}

function init() {
	var as_1 = new AbilityScore();
	var as_2 = new AbilityScore();
	as_1.Name = "A";
	as_2.Name = "B";
	var s_1 = new Skill();
	var s_2 = new Skill();
	as_1.Skills = [s_1];
	as_2.Skills = [s_2];
	s_1.Name = "A";
	s_2.Name = "B";
	s_1.AbilityScore = as_1;
	s_2.AbilityScore = as_2;
	as_1.save();
	as_2.save();
	s_1.save();
	s_2.save();
}

init();