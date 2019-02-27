
export class AbilityScore {
    Id: number;
    Name: string;
    Abbreviation: string;
    Description: string;
    // Skills: number[];
	// SavingThrows: number[];
    [key: string]: string|number|(()=>void);

    static TableRows : AbilityScore[] = [];

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

function init() {
    var a = new AbilityScore();
    var b = new AbilityScore();
    a.Name = "A";
    b.Name = "B";
    a.Id = 1;
    b.Id = 2;
    a.save();
    b.save();
}

init();