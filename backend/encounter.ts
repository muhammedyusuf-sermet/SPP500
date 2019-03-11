import {Monster} from "./entity/Monster";
import {User} from "./entity/User";
import {Encounter} from "./entity/Encounter";

/*
Sample curl request,
 curl --header "Content-Type: application/json" \
 --request POST \
 --data '{"Name": "Test", "Description": "Sup", "Monsters": [ {"Id": 1, "Name": 3} ] }' \
 http://localhost:3000/create/encounter
 */
export class EncounterFactory {
	public async Create(request: {payload: any, auth: any}) {
		var messages = [];

		const authInfo = request.auth;
		var user = await User.findOne({ Id: authInfo.credentials.id });

		const encounter = new Encounter();
		if (user) {
			encounter.Creator = user;
		}
		
		var data : Encounter = request.payload;
		
		if (!data.Name || data.Name == "") {
			messages.push("Name must be provided.");
		} else {
			encounter.Name = data.Name;
		}

		if (!data.Description || data.Description == "") {
			messages.push("Description must be provided.");
		} else {
			encounter.Description = data.Description;
		}

		var monstersArray : Monster[] = [];
		var monsters = data.Monsters;

		if (monsters) {
			for (let monsterObject of monsters) {
				var monster = await Monster.findOne({ Id: monsterObject.Id });

				if (monster) {
					monstersArray.push(monster);
				} else {
					messages.push("Monster is invalid: " + monsterObject.Id);
				}
			}
		}

		encounter.Monsters = monstersArray;

		if (messages.length == 0) {
			await encounter.save();

			return {
				"status": 201,
				"messages": ["success"]
			}
		} else {
			return {
				"status": 400,
				"messages": messages
			}
		}

	}

	public async Delete(request: {payload: any, auth: any}) {
		var messages = [];

		const authInfo = request.auth;
		const payload = request.payload;

 		var encounter = await Encounter.findOne({ Id: payload.Id, Creator : { Id: authInfo.credentials.id} });

 		if (!encounter) {
 			encounter = await Encounter.findOne({ Id: payload.Id});

 			if (encounter) {
				messages.push("Requester is not the creator of this encounter.")	
			} else {
				messages.push("There is no such encounter saved.")
			}
 		}

 		if (messages.length == 0 && encounter) {
			await encounter.remove();

 			return {
				"status": 201,
				"messages": ["success"]
			}

 		} else {
			return {
				"status": 400,
				"messages": messages
			}
		}
	}
}