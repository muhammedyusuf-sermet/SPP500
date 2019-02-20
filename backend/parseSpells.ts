import {getConnection} from "typeorm";
var fs = require('fs');

fs.readFile('5e-SRD-Spells.json', ParseSpellData);

function ParseSpellData (err: any, data: any): void{

    let Spells: Array<any> = [] // 5e-SRD-Spells.json
    let Data: any = JSON.parse(data)
    
    for (let i in Data)
    {
        let spell: any = 
        {
            Name: '',
            Level: 1,
            CastingTime: '',
            Range: '60 feet',
            Components: [],
            Material: '',
            Duration: '',
            Description: [],
            HigherLevel: '',
            School: ''
        }

        spell.Name = Data[i]['name']
        spell.Level = Data[i]['level']
        spell.CastingTime = Data[i]['casting_time']
        spell.Range = Data[i]['range']
        spell.Components = Data[i]['components']
        spell.Material = Data[i]['material']
        spell.Duration = Data[i]['duration']
        spell.Description = Data[i]['desc']
        spell.HigherLevel = Data[i]['higher_level']
        spell.School = Data[i]['school']['name']
        
        Spells.push(spell);
    }
    console.log(Spells)
    // Insert using query builder.
    // await getConnection()
    // .createQueryBuilder()
    // .insert()
    // .into(Spell)
    // .values(Spells)
    // .execute();  
}