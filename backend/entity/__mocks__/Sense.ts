
export class Sense {
	Id: number;
	Name: string;
	Description: string;
	[key: string]: string|number|(()=>void);

	static TableRows: Sense[] = [];

	static find(a: any) {
		if (a.select) {
			return this.TableRows;
		}
		var result = Sense.TableRows.slice(0);
		for (let key in a) {
			let value = a[key];
			result = result.filter(function (el: Sense) {
				return el[key] == value;
			});
		}

		return result
	}

	static findOne(a: any) {
		return this.find(a)[0]
	}

	save() {
		Sense.TableRows.push(this)
	}
}

function init() {
	var s_1 = new Sense();
	var s_2 = new Sense();
	s_1.Name = "A sense";
	s_2.Name = "B sense";
	s_1.Description = "A detection";
	s_2.Description = "B detection";
	s_1.save();
	s_2.save();
}

init();