var fs = require('fs');

function ToUpperCamelCase (value: string): string{
    var lowerCamel: string =  value.toLowerCase().replace(/\s+(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
    return lowerCamel.charAt(0).toUpperCase() + lowerCamel.substr(1); 
}

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
            DamageVulnerabilities: '',
            DamageResistances: '',
            DamageImmunities: '',
            ConditionImmunities: '',
            ChallengeRating: 0,
            AbilityScores: {},
            Skills: [],
            SavingThrows: {},
            SpecialAbilities: [],
            Actions: [],
            LegendaryActions: []         
        }

        monster.Name = Data[i]['name']
        monster.Size = Data[i]['size']
        monster.Type = ToUpperCamelCase(Data[i]['type'])
        monster.Race = Data[i]['subtype'] == '' ? 'AnyRace' : Data[i]['subtype']
        monster.Alignment = ToUpperCamelCase(Data[i]['alignment'])
        monster.ArmorClass = Data[i]['armor_class']
        monster.HitPoints = Data[i]['hit_points']
        monster.Damage = Data[i]['hit_dice']
        monster.Speed = Data[i]['speed']
        monster.Senses = Data[i]['senses']
        monster.Languages = Data[i]['languages']
        monster.DamageVulnerabilities = Data[i]['damage_vulnerabilities']
        monster.DamageResistances = Data[i]['damage_resistances']
        monster.DamageImmunities = Data[i]['damage_immunities']
        monster.ConditionImmunities = Data[i]['condition_immunities']
        monster.ChallengeRating = Data[i]['challenge_rating']

        // AbilityScores properties.
        if (Data[i].hasOwnProperty('strength')) { monster.AbilityScores.Strength = Data[i]['strength'] }
        if (Data[i].hasOwnProperty('dexterity')) { monster.AbilityScores.Dexterity = Data[i]['dexterity'] }
        if (Data[i].hasOwnProperty('constitution')) { monster.AbilityScores.Constitution = Data[i]['constitution'] }
        if (Data[i].hasOwnProperty('intelligence')) { monster.AbilityScores.Intelligence = Data[i]['intelligence'] }
        if (Data[i].hasOwnProperty('wisdom')) { monster.AbilityScores.Wisdom = Data[i]['wisdom'] }
        if (Data[i].hasOwnProperty('charisma')) { monster.AbilityScores.Charisma = Data[i]['charisma'] }

        // Skills properties.
        // TODO: add skills.

        // SavingThrows properties.
        if (Data[i].hasOwnProperty('strength_save')) { monster.SavingThrows.Strength = Data[i]['strength_save'] }
        if (Data[i].hasOwnProperty('dexterity_save')) { monster.SavingThrows.Dexterity = Data[i]['dexterity_save'] }
        if (Data[i].hasOwnProperty('constitution_save')) { monster.SavingThrows.Constitution = Data[i]['constitution_save'] }
        if (Data[i].hasOwnProperty('intelligence_save')) { monster.SavingThrows.Intelligence = Data[i]['intelligence_save'] }
        if (Data[i].hasOwnProperty('wisdom_save')) { monster.SavingThrows.Wisdom = Data[i]['wisdom_save'] }
        if (Data[i].hasOwnProperty('charisma_save')) { monster.SavingThrows.Charisma = Data[i]['charisma_save'] }

        monster.SpecialAbilities = Data[i]['special_abilities']
        monster.Actions = Data[i]['actions']
        monster.LegendaryActions = Data[i]['legendary_actions']

        monsters.push(monster);
    }
    fs.writeFileSync("./seeds/data/monsters.json", JSON.stringify(monsters,null,4))
});
