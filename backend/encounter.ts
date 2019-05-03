import {Monster} from "./entity/Monster";
import {User} from "./entity/User";
import {Encounter} from "./entity/Encounter";
import { IFactory } from "./monster";

/*
Sample curl request,
 curl --header "Content-Type: application/json" \
 --request POST \
 --data '{"Name": "Test", "Description": "Sup", "Monsters": [ {"Id": 1, "Name": 3} ] }' \
 http://localhost:3000/create/encounter
 */
export class EncounterFactory implements IFactory {
	public async Create(request: {auth: any, payload: any}) {
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

	public async Edit(request: {auth: any, payload: any}) {
    var messages = [];

		const authInfo = request.auth;
		const payload = request.payload;
    
		var encounter = await Encounter.findOne({ Id: payload.Id, Creator : { Id: authInfo.credentials.id} });

		if (encounter) {
			var data = request.payload;

			if (data.Name == "") {
				messages.push("Name should not be an empty string.");
			} else {
				encounter.Name = data.Name;
			}

			if (data.Description == "") {
				messages.push("Description should not be an empty string.");
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

		} else {
			// check if the encounter is valid
			encounter = await Encounter.findOne({ Id: payload.Id});

			if (encounter) {
				messages.push("Requester is not the creator of this encounter.")	
			} else {
				messages.push("There is no such encounter saved.")
			}
    }
		
		if (messages.length == 0 && encounter) {
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
  
	public async Delete(request: {auth: any, params: any}) {
		const encounterId = +request.params.encounterId
		const messages: string[] = [];

		if (isNaN(encounterId)) {
			messages.push("Parameter 'encounterId' must be a number.")
		}

		if (messages.length == 0) {
			const encounterDb = await Encounter.findOne<Encounter>({
				loadRelationIds: { relations: ['Creator'], disableMixedMap: true },
				where: { Id: encounterId }
			});
			if (encounterDb) {
				if (encounterDb.Creator.Id == request.auth.credentials.id) {
					await encounterDb.remove()
					return {
						"status": 201,
						"messages": ['success'],
					}
				} else {
					messages.push("Requester is not the owner.")
				}
			} else {
				messages.push("Encounter is not found.")
			}
		}
		return {
			"status": 400,
			"messages": messages,
		}
	}

	public async GetOne(request: {auth: any, params: any}) {
  	const authInfo = request.auth;
		const encounterId = +request.params.encounterId;

 		const messages: string[] = [];

 		if (isNaN(encounterId)) {
			messages.push("Parameter 'encounterId' must be a number.")
		}

 		if (messages.length == 0) {
			const encounter = await Encounter.findOne<Encounter>({
				relations: ['Monsters', 'Campaigns', 'Monsters.AbilityScores'],
				loadRelationIds: { relations: ['Creator'], disableMixedMap: true },
				where: { Id: encounterId }
			});
			if (encounter) {
				if (encounter.Creator.Id == authInfo.credentials.id) {
 					return {
						"status": 201,
						"messages": messages,
						"content": encounter,
					}
				} else {
					messages.push("Requester is not the owner.")
				}
			} else {
				messages.push("Encounter is not found.")
			}
			return {
				"status": 400,
				"messages": messages,
				"content": {},
			}
		} else {
			return {
				"status": 400,
				"messages": messages,
				"content": {},
			}
		}
	}

	public async GetMany(request: {auth: any, params: any}) {
		const authInfo = request.auth;
		var pageNumber = +request.params.page;
		var pageSize = +request.params.size;

 		var messages = [];

 		if (isNaN(pageNumber)) {
			messages.push("Parameter 'page' must be a number.")
		}

 		if (isNaN(pageSize)) {
			messages.push("Parameter 'size' must be a number.")
		}


		if (messages.length == 0) {
			var allEncounters = await Encounter.find({
				where: {Creator : { Id: authInfo.credentials.id}},
			});

			var respond = allEncounters.slice(pageSize*pageNumber, pageSize*(pageNumber+1))

			return {
				"status": 201,
				"messages": messages,
				"content": respond,
				"total": allEncounters.length
			}
		} else {
			return {
				"status": 400,
				"messages": messages,
				"content": [],
				"total": 0
			}
		}
	}
}