import { Monster } from "./Monster";
import { User } from "./User";

export class Encounter {
    Creator: User;
    Name: string;
    Description: string;
    Monsters: Monster[];

    [key: string]: string|User|Monster[]|(()=>void);

    static TableRows: Encounter[] = [];

    static find(a: any) {
        var result = Encounter.TableRows.slice(0);
        for (let key in a) {
            let value = a[key];
            result = result.filter(function (el: Encounter) {
                return el[key] == value;
            });
        }

        return result
    }

    static findOne(a: any) {
        return this.find(a)[0]
    }

    save() {
        Encounter.TableRows.push(this)
    }
}