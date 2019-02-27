var fs = require('fs');

fs.readFile('5e-SRD-Monsters.json',(err: any, data: any) => {

    var monsters: Array<JSON> = []
    let Data: any = JSON.parse(data)
    
    for (let i in Data)
    {
        let monster: any =
        {
            Name: '',
            Size: '',
            Type: '',
            Race: '',       
            Alignment: '',
            ArmorClass: '',
            HitPoints: '',
            Damage: '',
            Speed: '',
            Senses: '',
            Languages: '',
            ChallengeRating: 0,
            //SpecialAbilities: [],
            //Actions: [],
            //LegendaryActions: []
        }

        monster.Name = Data[i]['name']
        monster.Size = Data[i]['size']
        monster.Type = Data[i]['type']
        monster.Race = Data[i]['subtype'] == '' ? 'AnyRace' : Data[i]['subtype']
        monster.Alignment = Data[i]['alignment']
        monster.ArmorClass = Data[i]['armor_class']
        monster.HitPoints = Data[i]['hit_points']
        monster.Damage = Data[i]['hit_dice']
        monster.Speed = Data[i]['speed']
        monster.Senses = Data[i]['senses']
        monster.Languages = Data[i]['languages']
        monster.ChallengeRating = Data[i]['challenge_rating']
        //monster.SpecialAbilities = Data[i]['special_abilities']
        //monster.Actions = Data[i]['actions']
        //monster.LegendaryActions = Data[i]['legendary_actions']
        
        //console.log(monster)
       
        monsters.push(monster);
    }
    fs.writeFileSync("./seeds/data/monsters.json", JSON.stringify(monsters,null,4))
});
