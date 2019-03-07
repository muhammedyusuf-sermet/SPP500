
var fs = require('fs');

fs.readFile('5e-SRD-Ability-Scores.json',(err: any, data: any) => {

    interface IAbilityScore {
        Name: string,
        Abbreviation: string,
        Description: string,     
        Skills: {
            Name: string
        }[]
    };

    var abilityScores: Array<IAbilityScore> = []
    let Data: any = JSON.parse(data)

    for (let i in Data)
    {
        let abilityScore: IAbilityScore =
        {
            Name: '',
            Abbreviation: '',
            Description: '',
            Skills: []
        }

        abilityScore.Name = Data[i]['full_name']
        abilityScore.Abbreviation = Data[i]['name']

        var desc: string = ''
        Data[i]['desc'].forEach((value: any) => {
                desc += (desc.substr(desc.length - 1) == '.' ? " " + value : value);
            });
        abilityScore.Description = desc
       
        Data[i]['skills'].forEach((value: any) => {
                abilityScore.Skills.push({ 
                        Name: value.name
            });
        });
        
        abilityScores.push(abilityScore);
    }

    fs.writeFileSync("../seeds/data/abilityScores.json", JSON.stringify(abilityScores,null,4))
    console.log("Scraped all ability scores.")
});
