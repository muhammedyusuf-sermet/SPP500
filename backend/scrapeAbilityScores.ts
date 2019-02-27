import {getConnection} from "typeorm";
var fs = require('fs');

fs.readFile('5e-SRD-Ability-Scores.json', ParseAbilityScoreData)

function ParseAbilityScoreData (err: any, data: any): void{

    let AbilityScores: Array<any> = [] // 5e-SRD-Ability-Scores.json
    let Data: any = JSON.parse(data)
    
    for (let i in Data)
    {
        let abilityScore: any = 
        {
            Name: '',
            Abbreviation: '',
            Description: '',
        }

        abilityScore.Name = Data[i]['full_name']
        abilityScore.Abbreviation = Data[i]['name']
        abilityScore.Description = Data[i]['desc'][0]
        
        AbilityScores.push(abilityScore);
    }
    console.log(AbilityScores)
}