import { Monster } from "./Monster";
import { User } from "./User";

export class Encounter {
    Creator: User;
    Id: number;
    Name: string;
    Description: string;
    Monsters: Monster[];

    [key: string]: any|number|string|User|Monster[]|(()=>void);

    static TableRows: Encounter[] = [];

    static find(a: any): Encounter[] {
        var result = Encounter.TableRows.slice(0);
        if (a.select) {
            if (a.where) {
                return Encounter.find(a.where);
            } else {
                return result;
            }
		}
        for (let key in a) {
            let value = a[key];
            if (typeof value == 'object') {
                for (let key2 in value) {
                    let value2 = value[key2]
                    result = result.filter(function (el: Encounter) {
                        return el[key][key2] == value2;
                    });
                }
            } else {
                result = result.filter(function (el: Encounter) {
                    return el[key] == value;
                });
            }
        }

        return result
    }

    static findOne(a: any) {
        return this.find(a)[0]
    }

    remove() {
        var index = Encounter.TableRows.indexOf(this);
        if (index !== -1) {
            Encounter.TableRows.splice(index, 1);
        } 
    }

    save() {
        Encounter.TableRows.push(this)
    }
}