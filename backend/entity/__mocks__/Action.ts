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

    static remove(actions: Action[]) {
        for( var i = 0; i < Action.TableRows.length; i++){ 
			for (let action of actions) {
				if (action.Id == Action.TableRows[i].Id)
				    Action.TableRows.splice(i, 1);
					i--;
					break;
			}
		}
    }

    static save(actions: Action[]) {
        Action.TableRows.push(...actions);
    }

    save() {
        Action.TableRows.push(this);
    }

}