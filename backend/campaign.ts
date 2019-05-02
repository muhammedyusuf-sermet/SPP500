import {Campaign, ICampaignData} from "./entity/Campaign";
import {User} from "./entity/User";
import {Encounter} from "./entity/Encounter";
import { Character } from "./entity/Character";

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
		Id: Joi.number().greater(0).label('Id'),
		Name: Joi.string().required().max(50).label('Name'),
		Summary: Joi.string().allow('').max(1000).label('Summary'),
		Notes: Joi.string().allow('').max(2000).label('Notes'),
		Encounters: Joi.array().items(Joi.object({
			Id: Joi.number().integer().greater(0).required().valid(Joi.ref('$EncounterOptions')).label('Encounter Id')
		})).default([]),
		Characters: Joi.array().items(Joi.object({
			Id: Joi.number().integer().greater(0).required().valid(Joi.ref('$CharacterOptions')).label('Character Id')
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
		const allCharacters: Character[] = await Character.find(
			{
				select: ["Id"],
				where: {
					Creator: {
						Id: request.auth.credentials.id
					}
				}
			});
		const characterIds: number[] = [];
		const characterLookup: { [Id: number]: Character } = {};
		allCharacters.forEach((value) => {
			characterIds.push(value.Id);
			characterLookup[value.Id] = value;
		})
		const options: Joi.ValidationOptions = {
			abortEarly: false,
			convert: true,
			allowUnknown: false,
			context: {
				EncounterOptions: encounterIds,
				CharacterOptions: characterIds
			}
		}
		return await Joi.validate(
			request.payload,
			this.payloadSchema,
			options,
			async (errors: ValidationError, value: ICampaignData) => {
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

					campaign.Characters = [];
					for (let character of value.Characters) {
						campaign.Characters.push(characterLookup[character.Id]);
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

	public async Edit(request: {payload: any, auth: any}) {
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
		const allCharacters: Character[] = await Character.find(
			{
				select: ["Id"],
				where: {
					Creator: {
						Id: request.auth.credentials.id
					}
				}
			});
		const characterIds: number[] = [];
		const characterLookup: { [Id: number]: Character } = {};
		allCharacters.forEach((value) => {
			characterIds.push(value.Id);
			characterLookup[value.Id] = value;
		})
		const options: Joi.ValidationOptions = {
			abortEarly: false,
			convert: true,
			allowUnknown: false,
			context: {
				EncounterOptions: encounterIds,
				CharacterOptions: characterIds
			}
		}
		return await Joi.validate(
			request.payload,
			this.payloadSchema,
			options,
			async (errors: ValidationError, value: ICampaignData) => {
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
					const messages: string[] = [];
					const campaignId = +request.payload.Id;
					const campaignDb = await Campaign.findOne<Campaign>({
						loadRelationIds: { relations: ['Creator'], disableMixedMap: true },
						where: { Id: campaignId }
					});
					if (campaignDb) {
						if (campaignDb.Creator.Id == request.auth.credentials.id) {
							campaignDb.Name = value.Name;
							if (value.Summary)
								campaignDb.Summary = value.Summary;
							if (value.Notes)
								campaignDb.Notes = value.Notes;
							campaignDb.Encounters = [];
							if (value.Encounters) {
								for (const encounter of value.Encounters) {
									campaignDb.Encounters.push(encounterLookup[encounter.Id]);
								}
							}

							campaignDb.Characters = [];
							if (value.Characters) {
								for (const character of value.Characters) {
									campaignDb.Characters.push(characterLookup[character.Id]);
								}
							}

							await campaignDb.save();
							return {
								"status": 201,
								"messages": ["success"]
							}
						} else {
							messages.push("Requester is not the owner.")
						}
					} else {
						messages.push("Campaign is not found.")
					}
					return {
						"status": 400,
						"messages": messages,
						"content": {},
					}
				}
			}
		);
	}

	public async Delete(request: {auth: any, params: any}){
		const campaignId = +request.params.campaignId;
		const messages: string[] = [];
		if (isNaN(campaignId)) {
			messages.push("Parameter 'campaignId' must be a number.")
		}

		if (messages.length == 0) {
			const campaignDb = await Campaign.findOne<Campaign>({
				loadRelationIds: { relations: ['Creator'], disableMixedMap: true },
				where: { Id: campaignId }
			});
			if (campaignDb) {
				if (campaignDb.Creator.Id == request.auth.credentials.id) {
					await campaignDb.remove()
					return {
						"status": 201,
						"messages": ['success'],
					}
				} else {
					messages.push("Requester is not the owner.")
				}
			} else {
				messages.push("Campaign is not found.")
			}
		}
		return {
			"status": 400,
			"messages": messages,
		}
	}
  
  public async GetOne(request: {params: any, auth: any}) {
  	const authInfo = request.auth;
		var campaignId = +request.params.campaignId;
		
		var messages: string[] = [];

		if (isNaN(campaignId)) {
			messages.push("Parameter 'campaignId' must be a number.")
		}

		if (messages.length == 0) {
			const campaignDb = await Campaign.findOne<Campaign>({
				loadRelationIds: { relations: ['Creator', 'Encounters', 'Characters'], disableMixedMap: true },
				where: { Id: campaignId }
			});
			if (campaignDb) {
				if (campaignDb.Creator.Id == authInfo.credentials.id) {
					// The frontend doesn't need the Creator info
					delete campaignDb.Creator
					// TODO: Allow the frontend to see characters remove this line
					delete campaignDb.Characters
					return {
						"status": 201,
						"messages": messages,
						"content": campaignDb,
					}
				} else {
					messages.push("Requester is not the owner.")
				}
			} else {
				messages.push("Campaign is not found.")
			}
		}
		return {
			"status": 400,
			"messages": messages,
			"content": {},
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