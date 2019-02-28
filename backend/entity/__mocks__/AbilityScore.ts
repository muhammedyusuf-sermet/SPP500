import { Skill } from "./Skill";

export class AbilityScore {
	Id: number;
	Name: string;
	Abbreviation: string;
	Description: string;
	Skills: Skill[];
	[key: string]: string|Skill[]|number|(()=>void);

	static TableRows: AbilityScore[] = [];

	static find(a: any) {
		var result = AbilityScore.TableRows.slice(0);
		for (let key in a) {
			let value = a[key];
			result = result.filter(function (el: AbilityScore) {
				return el[key] == value;
			});
		}

		return result
	}

	static findOne(a: any) {
		return this.find(a)[0]
	}

	save() {
		AbilityScore.TableRows.push(this)
	}
}