var fs = require('fs');

fs.readFile('5e-SRD-Conditions.json', ParseConditionData)

function ParseConditionData (err: any, data: any): void{

    let Conditions: Array<any> = [] 
    let Data: any = JSON.parse(data)
    
    for (let i in Data)
    {
        let condition: any = 
        {
            Name: '',
            Description: '',
        }

        condition.Name = Data[i]['name']
        condition.Description = Data[i]['desc'][0]
        
        Conditions.push(condition);
    }
    console.log(Conditions)
}