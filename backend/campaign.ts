import {Campaign} from "./entity/Campaign";
import {User} from "./entity/User";
import {Encounter} from "./entity/Encounter";

/*
Sample curl request,
 curl --header "Content-Type: application/json" \
 --request POST \
 --data '
 {
	"Name": "test",
	"Summary": "test",
	"Notes": "",
	"Encounters": [
		{"Id": 1},
		{"Id": 2}
	]
}' \
 http://localhost:3000/campaign/create
 */
export class CampaignFactory {
	public async Create(request: {payload: any, auth: any}) {
		var messages = [];

		const authInfo = request.auth;
		var user = await User.findOne({ Id: authInfo.credentials.id });

		const campaign = new Campaign();
		if (user) {
			campaign.Creator = user;
		}
		
		var data : Campaign = request.payload;
		
		if (!data.Name || data.Name == "") {
			messages.push("Name must be provided.");
		} else {
			campaign.Name = data.Name;
		}

		if (!data.Summary || data.Summary == "") {
			messages.push("Summary must be provided.");
		} else {
			campaign.Summary = data.Summary;
		}

		if (!data.Notes) {
			campaign.Notes = "";
		} else {
			campaign.Notes = data.Notes;
		}

		var encountersArray : Encounter[] = [];
		var encounters = data.Encounters;

		if (encounters) {
			for (let encounterObject of encounters) {
				var encounter = await Encounter.findOne({ Id: encounterObject.Id });

				if (encounter) {
					encountersArray.push(encounter);
				} else {
					messages.push("Encounter is invalid: " + encounterObject.Id);
				}
			}
		}

		campaign.Encounters = encountersArray;

		if (messages.length == 0) {
			await campaign.save();

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