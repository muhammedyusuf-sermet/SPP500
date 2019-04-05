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

    static find(a: any): Campaign[] {
        var result = Campaign.TableRows.slice(0);
        var skip = -1;
        var take = -1;

        if (a.select) {
            if (a.where) {
                return Campaign.find(a.where);
            } else {
                return result;
            }
        } else {
            if (a.where) {
                var query = a.where;
                if (a.skip) {
                    query["skip"] = a.skip;
                }

                if (a.take) {
                    query["take"] = a.take;   
                }

                return Campaign.find(query);
            } else {
                if (a.skip) {
                    skip = a.skip;
                }

                if (a.take) {
                    take = a.take;   
                }
            }
        }

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
                if (key != "skip" && key != "take") {
                    result = result.filter(function (el: Campaign) {
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
        var index = Campaign.TableRows.indexOf(this);
        if (index !== -1) {
            Campaign.TableRows.splice(index, 1);
        } 
    }

    save() {
        Campaign.TableRows.push(this)
    }

    static clear() {
        Campaign.TableRows = [];
    }
}