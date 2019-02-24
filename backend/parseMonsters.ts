//import {getConnection} from "typeorm";
var fs = require('fs');

fs.readFile('5e-SRD-Monsters.json', ParseMonsterData);

function ParseMonsterData (err: any, data: any): void{

    let Monsters: Array<any> = []
    let Data: any = JSON.parse(data)
    
    for (let i in Data)
    {
        let monster: any = 
        {
            Name: '',
            Size: '',
            Type: '',
            Race: '',       // Enum.
            Alignment: '',
            Armor_Class: '',
            Hit_Points: '',
            Hit_Dice: '',
            Speed: '',
            Senses: '',
            Languages: '',
            Challange_ratting: 0,
            Special_abilities: [],
            Actions: [],
            Legendary_Actions: []
        }
        monster.Name = Data[i]['name']
        monster.Size = Data[i]['size']
        monster.Type = Data[i]['type']
        //monster.Race = Data[i]['']
        monster.Alignment = Data[i]['alignment']
        monster.Armor_Class = Data[i]['armor_class']
        monster.Hit_Points = Data[i]['hit_points']
        monster.Hit_Dice = Data[i]['hit_dice']
        monster.Speed = Data[i]['speed']
        monster.Senses = Data[i]['senses']
        monster.Languages = Data[i]['languages']
        monster.Challange_ratting = Data[i]['challenge_rating']
        monster.Special_abilities = Data[i]['special_abilities']
        monster.Actions = Data[i]['actions']
        monster.Legendary_Actions = Data[i]['legendary_actions']
        
        Monsters.push(monster);
    }
    console.log(Monsters)
}
