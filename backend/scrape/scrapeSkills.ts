var fs = require('fs');

fs.readFile('5e-SRD-Skills.json',(err: any, data: any) => {

    interface ISkill {
        Name: string,
        Description: string,    
        AbilityScore: {
            Abbriviation?: string
        }
    };

    var skills: Array<ISkill> = []
    let Data: any = JSON.parse(data)

    for (let i in Data)
    {
        let skill: ISkill =
        {
            Name: '',
            Description: '',
            AbilityScore: {}
        }

        skill.Name = Data[i]['name']
    
        var desc: string = ''
        Data[i]['desc'].forEach((value: any) => {
                desc += (desc.substr(desc.length - 1) == '.' ? " " + value : value);
            });
        skill.Description = desc
       
        skill.AbilityScore.Abbriviation = Data[i]['ability_score']['name']
        
        skills.push(skill);
    }

    fs.writeFileSync("../seeds/data/skills.json", JSON.stringify(skills,null,4))
    console.log("Scraped all skills.")
});
