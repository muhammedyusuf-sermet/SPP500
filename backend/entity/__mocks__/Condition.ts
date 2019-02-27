//var conditions : Condition[] = [];

export class Condition {
    Id: number;
    Name: string;
    Description: string;
    [key: string]: string|number|(()=>void);

    static TableRows: Condition[] = []

	static find(a: any) {
        var result = Condition.TableRows.slice(0);
        for (let key in a) {
            let value = a[key];
            result = result.filter(function (el: Condition) {
                return el[key] == value;
            });
        }

        return result
    }

    static findOne(a: any) {
        return this.find(a)[0]
    }

    save() {
        Condition.TableRows.push(this)
    }
}

function init() {
    var a = new Condition();
    var b = new Condition();
    a.Name = "A";
    b.Name = "B";
    a.Id = 1;
    b.Id = 2;
    a.save();
    b.save();
}

init();