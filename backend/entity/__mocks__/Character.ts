import { User } from "./User";
import { CharacterRace, CharacterClass } from "../CharacterEnums";
import { Campaign } from "./Campaign";

export class Character {
    Creator: User;
    Id: number;
    Name: string;
    Level: number;
    Race: CharacterRace;
    Class: CharacterClass;
    MaxHealth: number;
    ArmorClass: number;
    Notes: string;

	Camppaigns: Campaign[];
    [key: string]: any|number|string|User|Campaign[]|(()=>void);

    static TableRows: Character[] = [];

    static find(a: any): Character[] {
        var result = Character.TableRows.slice(0);
        var skip = -1;
        var take = -1;

        if (a.select) {
            if (a.where) {
                return Character.find(a.where);
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

                return Character.find(query);
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
                    result = result.filter(function (el: Character) {
                        return el[key][key2] == value2;
                    });
                }
            } else {
                if (key != "skip" && key != "take") {
                    result = result.filter(function (el: Character) {
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
        var index = Character.TableRows.indexOf(this);
        if (index !== -1) {
            Character.TableRows.splice(index, 1);
        } 
    }

    save() {
        Character.TableRows.push(this)
    }

    static clear() {
        Character.TableRows = [];
    }
}