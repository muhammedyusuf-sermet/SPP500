//import {getConnection} from "typeorm";

var fs = require('fs');
let Spells: Array<any> = [] // 5e-SRD-Spells.json
let AbilityScores: Array<any> = [] // 5e-SRD-Ability-Scores.json

fs.readFile('5e-SRD-Spells.json', ParseSpellData);
fs.readFile('5e-SRD-Ability-Scores.json', ParseAbilityScoreData)

function ParseSpellData (err: any, data: any): void{

    let Data: any = JSON.parse(data)
    
    for (let i in Data)
    {
        let spell: any = 
        {
            Name: '',
            Level: 1,
            Casting_Time: '',
            Range: '60 feet',
            Components: [],
            Material: '',
            Duration: '',
            Description: [],
            Higher_Level: '',
            School: ''
        }

        spell.Name = Data[i]['name']
        spell.Level = Data[i]['level']
        spell.Casting_Time = Data[i]['casting_time']
        spell.Range = Data[i]['range']
        spell.Components = Data[i]['components']
        spell.Material = Data[i]['material']
        spell.Duration = Data[i]['duration']
        spell.Description = Data[i]['desc']
        spell.Higher_Level = Data[i]['higher_level']
        spell.School = Data[i]['school']['name']
        
        Spells.push(spell);
    }

    // Output all spells in console.
    // console.log(Spells)

    // Insert using query builder.
    // await getConnection()
    // .createQueryBuilder()
    // .insert()
    // .into(Spell)
    // .values(Spells)
    // .execute();  
}

function ParseAbilityScoreData (err: any, data: any): void{

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
    // Output all ability scores in console.
    // console.log(AbilityScores)
}
