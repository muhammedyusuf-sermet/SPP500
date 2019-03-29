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
        var skip = -1;
        var take = -1;

        if (a.select) {
            if (a.where) {
                return Encounter.find(a.where);
            } else {
                return result;
            }
		}
        for (let key in a) {
            let value = a[key];
            if (key == "skip") {
                skip = value;
            } else if (key == "take") {
                take = value;
            } else {
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
        }

        if (skip > 0) {
            result = result.slice(skip, result.length)
        }

        if (take > 0) {
            result = result.slice(0, take)
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

    static clear() {
        Monster.TableRows = [];
    }
}