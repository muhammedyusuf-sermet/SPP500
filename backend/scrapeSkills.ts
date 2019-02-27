import {getConnection} from "typeorm";
var fs = require('fs');

fs.readFile('5e-SRD-Spells.json', ParseSkillData);

function ParseSkillData (err: any, data: any): void{

    let Skills: Array<any> = []
    let Data: any = JSON.parse(data)
    
    for (let i in Data)
    {
        let skill: any = 
        {
            //AbilityScoreId: 1,
            Name: '',
            Description: '',
        }
        //skill.AbilityScoreId = Data[i]
        skill.Name = Data[i]['name']
        skill.Description = Data[i]['desc'][0]
        
        Skills.push(skill);
    }
    console.log(Skills)
}
