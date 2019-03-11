import { MonsterAction } from "./../MonsterEnums";
import { Monster } from "./Monster";

export class Action {
    Id: number;
    Monster: Monster;
    Name: string;
    Description: string;
    HitBonus: number;
    Damage: string;
    DamageBonus: number;
    Type: MonsterAction;

    [key: string]: string|number|Monster|MonsterAction|(()=>void);

    static TableRows: Action[] = [];

    static find(a: any) {
        var result = Action.TableRows.slice(0);
        for (let key in a) {
            let value = a[key];
            result = result.filter(function (el: Action) {
                return el[key] == value;
            });
        }

        return result;
    }

    static findOne(a: any) {
        return this.find(a)[0];
    }

    static save(actions: Action[]) {
        Action.TableRows.push(...actions);
    }

    save() {
        Action.TableRows.push(this);
    }

}