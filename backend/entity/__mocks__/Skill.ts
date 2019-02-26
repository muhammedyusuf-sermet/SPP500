// import { AbilityScore } from "./AbilityScore";
var skills : Skill[] = [];

export class Skill {
    Id: number;
    AbilityScore: number;
    Name: string;
    Description: string;
    [key: string]: string|number|(()=>void);

    static find(a: any) {
        var result = skills.slice(0);
        for (let key in a) {
            let value = a[key];
            result = result.filter(function (el: Skill) {
                return el[key] == value;
            });
        }

        return result
    }

    static findOne(a: any) {
        return this.find(a)[0]
    }

    save() {
        skills.push(this)
    }
}

function init() {
    var a = new Skill();
    var b = new Skill();
    a.Name = "A";
    b.Name = "B";
    a.AbilityScore = 1;
    b.AbilityScore = 2;
    a.Id = 1;
    b.Id = 2;
    a.save();
    b.save();
}

init();