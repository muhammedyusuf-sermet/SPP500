import {Campaign} from "./entity/Campaign";
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
	public async Edit(request: {payload: any, auth: any}) {
	var messages = [];

		const authInfo = request.auth;
		const payload = request.payload;

		var campaign = await Campaign.findOne({ Id: payload.Id, Creator : { Id: authInfo.credentials.id} });

		if (campaign) {
			var data = request.payload;

			if (!data.Name || data.Name == "") {
				messages.push("Name should not be an empty string.");
			} else {
				campaign.Name = data.Name;
			}

	 		if (!data.Summary || data.Summary == "") {
				messages.push("Summary should not be an empty string.");
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

		} else {
			// check if the encounter is valid
			campaign = await Campaign.findOne({ Id: payload.Id});

			if (campaign) {
				messages.push("Requester is not the creator of this campaign.")	
			} else {
				messages.push("There is no such campaign saved.")
			}
	}
		
	if (messages.length == 0 && campaign) {
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