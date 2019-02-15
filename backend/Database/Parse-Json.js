//import {getConnection} from "typeorm";
var fs = require('fs');
var Spells = [];
fs.readFile('5e-SRD-Spells.json', ParseSpellData);
function ParseSpellData(err, data) {
    var SpellData = JSON.parse(data);
    for (var i in SpellData) {
        var spell = {
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
        };
        spell.Name = SpellData[i]['name'];
        spell.Level = SpellData[i]['level'];
        spell.Casting_Time = SpellData[i]['casting_time'];
        spell.Range = SpellData[i]['range'];
        spell.Components = SpellData[i]['components'];
        spell.Material = SpellData[i]['material'];
        spell.Duration = SpellData[i]['duration'];
        spell.Description = SpellData[i]['desc'];
        spell.Higher_Level = SpellData[i]['higher_level'];
        spell.School = SpellData[i]['school']['name'];
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
