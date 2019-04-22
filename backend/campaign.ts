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
import Joi, { ValidationError, ValidationErrorItem } from 'joi';
import { IFactory } from "./monster";

export class CampaignFactory implements IFactory {
	private payloadSchema = Joi.object({
		Name: Joi.string().required().max(50),
		Summary: Joi.string().required().max(1000),
		Notes: Joi.string().max(2000),
		Encounters: Joi.array().items(Joi.object({
			Id: Joi.number().integer().greater(0).required().valid(Joi.ref('$EncounterOptions')).label('Encounter Id')
		})).default([])
	});
	public async Create(request: {auth: any, payload: any}) {
		const allEncounters: Encounter[] = await Encounter.find(
			{
				select: ["Id"],
				where: {
					Creator: {
						Id: request.auth.credentials.id
					}
				}
			});
		const encounterIds: number[] = [];
		const encounterLookup: { [Id: number]: Encounter } = {};
		allEncounters.forEach((value) => {
			encounterIds.push(value.Id);
			encounterLookup[value.Id] = value;
		})
		const options: Joi.ValidationOptions = {
			abortEarly: false,
			convert: true,
			allowUnknown: false,
			context: {
				EncounterOptions: encounterIds
			}
		}
		return await Joi.validate(
			request.payload,
			this.payloadSchema,
			options,
			async (errors: ValidationError, value: any) => {
				if(errors) {
					const messages: Set<string> = new Set<string>();
					errors.details.forEach((error: ValidationErrorItem) => {
						let message: string = ''
						if ((error.type == 'any.allowOnly') && error.context && options) {
							message = `"${error.context.label}" ${error.context.value} is invalid`
						} else {
							message = error.message
						}
						messages.add(message);
					});
					return {
						"status": 400,
						"messages": Array.from(messages.values())
					};
				} else {
					const campaign: Campaign = Object.assign(new Campaign(), value);
					const authInfo = request.auth;
					const user = await User.findOne({ Id: authInfo.credentials.id });
					if (user) {
						campaign.Creator = user;
					}
					
					campaign.Encounters = [];
					for (let encounter of value.Encounters) {
						campaign.Encounters.push(encounterLookup[encounter.Id]);
					}

					await campaign.save();
					return {
						"status": 201,
						"messages": ["success"]
					}
				}
			}
		);
	}

	public async Edit(request: {auth: any, payload: any}) {
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
			};
		} else {
			return {
				"status": 400,
				"messages": messages
			};
		}
	}


	public async Delete(request: {auth: any, payload: any}) {
		var messages = [];

		const authInfo = request.auth;
		const payload = request.payload;
 		var campaign = await Campaign.findOne({ Id: payload.Id, Creator : { Id: authInfo.credentials.id} });

 		if (!campaign) {
 			campaign = await Campaign.findOne({ Id: payload.Id});

 			if (campaign) {
				messages.push("Requester is not the creator of this campaign.")	
			} else {
				messages.push("There is no such campaign saved.")
			}
 		}

 		if (messages.length == 0 && campaign) {
			await campaign.remove();

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
  
  	public async GetOne(request: {auth: any, params: any}) {
  		const authInfo = request.auth;
		var campaignId = +request.params.campaignId;
		
		var messages: string[] = [];

		if (isNaN(campaignId)) {
			messages.push("Parameter 'campaignId' must be a number.")
		}

		if (messages.length == 0) {
			let campaign = await Campaign.findOne({
				relations: ['Encounters'], 
				where: { Id: campaignId, Creator : { Id: authInfo.credentials.id} }
			});
			if (campaign) {
			
				return {
					"status": 201,
					"messages": messages,
					"content": campaign,
				}
			} else {
				let campaign = await Campaign.findOne({
					relations: ['Encounters'], 
					where: { Id: campaignId}
				});
				if(campaign) {
					messages.push("Requester is not the owner.")
				} else {
					messages.push("Campaign is not found.")
				}
				return {
					"status": 400,
					"messages": messages,
					"content": {},
				}
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
			var allCampaigns = await Campaign.find({
				relations: ['Encounters'],
				where: {Creator : { Id: authInfo.credentials.id}},
			});

			var respond = allCampaigns.slice(pageSize*pageNumber, pageSize*(pageNumber+1))

			return {
				"status": 201,
				"messages": messages,
				"content": respond,
				"total": allCampaigns.length
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