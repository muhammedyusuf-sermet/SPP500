import { MonsterAction, Size, MonsterType, MonsterRace, Alignment, Environment } from "../entity/MonsterEnums";
import { IMonsterData } from "../entity/Monster";

var fs = require('fs');

function ToUpperCamelCase (value: string): string | undefined{
    if(value == undefined){
        return undefined;
    }
    var lowerCamel: string =  value.toLowerCase().replace(/[-\s]+(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
    return lowerCamel.charAt(0).toUpperCase() + lowerCamel.substr(1); 
}

fs.readFile('5e-SRD-Monsters.json',(err: any, data: any) => {

    interface IMonsterDataScrape {
        Skills: { Name: string, Bonus: number }[]
    }

    var monsters: Array<IMonsterData & IMonsterDataScrape> = []
    let Data: any = JSON.parse(data)

    for (let i in Data)
    {
        let monster: IMonsterData & IMonsterDataScrape = {
            Name: '',
            AbilityScores: {},
            SavingThrows: {},
            Skills: [],
            Actions: [],
            Encounters: []
        };

        monster.Name = Data[i]['name'];
        
        const size = ToUpperCamelCase(Data[i]['size']);
        const type = ToUpperCamelCase(Data[i]['type']);
        const race = Data[i]['subtype'] == '' ? 'AnyRace' : ToUpperCamelCase(Data[i]['subtype']);
        const alignment = Data[i]['alignment'] == '' ? 'Unaligned' : ToUpperCamelCase(Data[i]['alignment']);
        const environment = Data[i]['environment'] ? Environment.Grassland : ToUpperCamelCase(Data[i]['environment']);

        monster.Size = Size[size as keyof typeof Size];
        monster.Type = MonsterType[type as keyof typeof MonsterType];
        monster.Race = MonsterRace[race as keyof typeof MonsterRace];
        monster.Alignment = Alignment[alignment as keyof typeof Alignment]
        monster.Environment = Environment[environment as keyof typeof Environment]
        
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
        monster.AbilityScores = {
            Strength: Data[i]['strength'],
            Dexterity: Data[i]['dexterity'],
            Constitution: Data[i]['constitution'],
            Intelligence: Data[i]['intelligence'],
            Wisdom: Data[i]['wisdom'],
            Charisma: Data[i]['charisma']
        };

        // Skills properties.
        const possibleSkills: string[] = 
        [ "acrobatics", "arcana", "athletics", "deception", "history", "insight", 
          "intimidation", "investigation", "medicine", "nature", "perception", 
          "performance", "persuasion", "religion", "stealth", "survival"];
        const actualSkills: string[] = 
        [ "Acrobatics", "Arcana", "Athletics", "Deception", "History", "Insight", 
          "Intimidation", "Investigation", "Medicine", "Nature", "Perception", 
          "Performance", "Persuasion", "Religion", "Stealth", "Survival"];
        monster.Skills = [];
        for (let skillIndex in possibleSkills){
            const bonus = Data[i][possibleSkills[skillIndex]];
            if (bonus) {
                monster.Skills.push({
                    Name: actualSkills[skillIndex],
                    Bonus: bonus
                });
            }
        }

        // SavingThrows properties.
        monster.SavingThrows = {
            Strength: Data[i]['strength_save'],
            Dexterity: Data[i]['dexterity_save'],
            Constitution: Data[i]['constitution_save'],
            Intelligence: Data[i]['intelligence_save'],
            Wisdom: Data[i]['wisdom_save'],
            Charisma: Data[i]['charisma_save']
        };

        monster.Actions = [];
        if(Data[i]['special_abilities']){
            Data[i]['special_abilities'].forEach((value: any) => {
                monster.Actions.push({ 
                    Name: value["name"],
                    Description: value["desc"],
                    HitBonus: value["attack_bonus"],
                    Damage: value["damage_dice"],
                    DamageBonus: value["damage_bonus"],
                    Type: MonsterAction.SpecialAbility
                });
            });
        }
        if(Data[i]['actions']){
            Data[i]['actions'].forEach((value: any) => {
                monster.Actions.push({ 
                    Name: value.name,
                    Description: value["desc"],
                    HitBonus: value["attack_bonus"],
                    Damage: value["damage_dice"],
                    DamageBonus: value["damage_bonus"],
                    Type: MonsterAction.Action
                });
            });
        }
        if(Data[i]['legendary_actions']){
            Data[i]['legendary_actions'].forEach((value: any) => {
                monster.Actions.push({ 
                    Name: value.name,
                    Description: value["desc"],
                    HitBonus: value["attack_bonus"],
                    Damage: value["damage_dice"],
                    DamageBonus: value["damage_bonus"],
                    Type: MonsterAction.LegendaryAction
                });
            });
        }

        monsters.push(monster);
    }
    fs.writeFileSync("./seeds/data/monsters.json", JSON.stringify(monsters,null,4))
    console.log("Scraped all monsters.")
});
