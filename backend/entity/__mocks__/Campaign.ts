import { Encounter } from "./Encounter";
import { User } from "./User";

export class Campaign {
    Creator: User;
    Id: number;
    Name: string;
    Summary: string;
    Notes: string;
    Encounters: Encounter[];

    [key: string]: any|number|string|User|Encounter[]|(()=>void);

    static TableRows: Campaign[] = [];

    static find(a: any) {
        var result = Campaign.TableRows.slice(0);
        for (let key in a) {
            let value = a[key];
            if (typeof value == 'object') {
                for (let key2 in value) {
                    let value2 = value[key2]
                    result = result.filter(function (el: Campaign) {
                        return el[key][key2] == value2;
                    });
                }
            } else {
                result = result.filter(function (el: Campaign) {
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
        var index = Campaign.TableRows.indexOf(this);
        if (index !== -1) {
            Campaign.TableRows.splice(index, 1);
        } 
    }

    save() {
        Campaign.TableRows.push(this)
    }
}