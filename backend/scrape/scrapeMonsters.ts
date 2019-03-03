import { MonsterAction } from "../entity/MonsterEnums";

var fs = require('fs');

function ToUpperCamelCase (value: string): string{
    var lowerCamel: string =  value.toLowerCase().replace(/[-\s]+(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
    return lowerCamel.charAt(0).toUpperCase() + lowerCamel.substr(1); 
}

fs.readFile('5e-SRD-Monsters.json',(err: any, data: any) => {

    interface IMonster {
        Name: string,
        Size?: string,
        Type?: string,
        Race?: string,       
        Alignment?: string,
        ArmorClass?: string,
        HitPoints?: string,
        HitPointDistribution?: string,
        Speed?: string,
        Senses?: string,
        Languages?: string,
        DamageVulnerabilities?: string,
        DamageResistances?: string,
        DamageImmunities?: string,
        ConditionImmunities?: string,
        ChallengeRating?: number,
        AbilityScores: {
            Strength?: string,
            Dexterity?: string,
            Constitution?: string,
            Intelligence?: string,
            Wisdom?: string,
            Charisma?: string
        },
        Skills?: [],
        SavingThrows: {
            Strength?: string,
            Dexterity?: string,
            Constitution?: string,
            Intelligence?: string,
            Wisdom?: string,
            Charisma?: string
        },
        Actions: {
            Name: string,
            Description?: string,
            HitBonus?: number,
            Damage?: string,
            DamageBonus?: number,
            Type: MonsterAction
        }[]
    };

    var monsters: Array<IMonster> = []
    let Data: any = JSON.parse(data)

    for (let i in Data)
    {
        let monster: IMonster =
        {
            Name: '',
            Size: '',
            Type: '',
            Race: '',       
            Alignment: '',
            ArmorClass: '',
            HitPoints: '',
            HitPointDistribution: '',
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
            Actions: []
        }

        monster.Name = Data[i]['name']
        monster.Size = ToUpperCamelCase(Data[i]['size'])
        monster.Type = ToUpperCamelCase(Data[i]['type'])
        monster.Race = Data[i]['subtype'] == '' ? 'AnyRace' : ToUpperCamelCase(Data[i]['subtype'])
        monster.Alignment = Data[i]['alignment'] == '' ? 'Unaligned' : ToUpperCamelCase(Data[i]['alignment'])
        monster.ArmorClass = Data[i]['armor_class']
        monster.HitPoints = Data[i]['hit_points']
        monster.HitPointDistribution = Data[i]['hit_dice']
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

        monster.Actions = [];
        if(Data[i]['special_abilities']){
            Data[i]['special_abilities'].forEach((value: any) => {
                monster.Actions.push({ 
                    Name: value.name,
                    Description: value.desc,
                    HitBonus: value.attack_bonus,
                    Damage: value.damage_dice,
                    DamageBonus: value.damage_bonus,
                    Type: MonsterAction.SpecialAbility
                });
            });
        }
        if(Data[i]['actions']){
            Data[i]['actions'].forEach((value: any) => {
                monster.Actions.push({ 
                    Name: value.name,
                    Description: value.desc,
                    HitBonus: value.attack_bonus,
                    Damage: value.damage_dice,
                    DamageBonus: value.damage_bonus,
                    Type: MonsterAction.Action
                });
            });
        }
        if(Data[i]['legendary_actions']){
            Data[i]['legendary_actions'].forEach((value: any) => {
                monster.Actions.push({ 
                    Name: value.name,
                    Description: value.desc,
                    HitBonus: value.attack_bonus,
                    Damage: value.damage_dice,
                    DamageBonus: value.damage_bonus,
                    Type: MonsterAction.LegendaryAction
                });
            });
        }

        monsters.push(monster);
    }
    fs.writeFileSync("./seeds/data/monsters.json", JSON.stringify(monsters,null,4))
    console.log("Scraped all monsters.")
});
