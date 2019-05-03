import {Character, ICharacterData} from "./entity/Character";
import {Campaign} from "./entity/Campaign";
import {User} from "./entity/User";
import {CharacterClass, CharacterRace } from "./entity/CharacterEnums";

/*
Sample curl request,
 curl --header "Content-Type: application/json" \
 --request POST \
 --data '
 {
	"Name": "test",
	"Campaigns": [
		{"Id": 1}
	]
}' \
 http://localhost:3000/character/create
 */
import Joi, { ValidationError, ValidationErrorItem } from 'joi';
import { IFactory } from "./monster";

export class CharacterFactory implements IFactory {
	private payloadSchema = Joi.object({
		Id: Joi.number().label('Id'),
		Name: Joi.string().required().max(50).label('Name'),
		Level: Joi.number().integer().greater(0).label('Level'),
		Class: Joi.string().valid(Joi.ref('$ClassOptions')),
		Race: Joi.string().valid(Joi.ref('$RaceOptions')),
		MaxHealth: Joi.number().integer().greater(0).label('MaxHealth'),
		ArmorClass: Joi.number().integer().greater(0).label('ArmorClass'),
		Notes: Joi.string().max(1000),
		Campaigns: Joi.array().items(Joi.object({
			Id: Joi.number().integer().greater(0).required().label('Campaign Id')
		})).default([])
	});
	public async Create(request: {auth: any, payload: any}) {
		const allCampaigns: Campaign[] = await Campaign.find(
			{
				select: ["Id"],
				where: {
					Creator: {
						Id: request.auth.credentials.id
					}
				}
			});
		const campaignIds: number[] = [];
		const campaignLookup: { [Id: number]: Campaign } = {};
		allCampaigns.forEach((value) => {
			campaignIds.push(value.Id);
			campaignLookup[value.Id] = value;
		})
		const options: Joi.ValidationOptions = {
			abortEarly: false,
			convert: true,
			allowUnknown: false,
			context: {
				CampaignOptions: campaignIds,
				ClassOptions: Object.keys(CharacterClass),
				RaceOptions: Object.keys(CharacterRace),
			}
		}
		return await Joi.validate(
			request.payload,
			this.payloadSchema,
			options,
			async (errors: ValidationError, value: ICharacterData) => {
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
					const character: Character = Object.assign(new Character(), value);
					const authInfo = request.auth;
					const user = await User.findOne({ Id: authInfo.credentials.id });
					if (user) {
						character.Creator = user;
					}
					
					character.Campaigns = [];
					for (let campaign of value.Campaigns) {
						character.Campaigns.push(campaignLookup[campaign.Id]);
					}

					await character.save();
					return {
						"status": 201,
						"messages": ["success"]
					}
				}
			}
		);
	}
	public async Edit(request: {auth: any, payload:any}) {
		const options: Joi.ValidationOptions = {
			abortEarly: false,
			convert: true,
			allowUnknown: false,
			context: {
				ClassOptions: Object.keys(CharacterClass),
				RaceOptions: Object.keys(CharacterRace),
			}
		}
		return await Joi.validate(
			request.payload,
			this.payloadSchema,
			options,
			async (errors: ValidationError, value: ICharacterData) => {
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
					const characterId = +request.payload.Id;
					const characterDb = await Character.findOne<Character>({
						loadRelationIds: { relations: ['Creator'], disableMixedMap: true },
						where: { Id: characterId }
					});
					if (characterDb) {
						if (characterDb.Creator.Id == request.auth.credentials.id) {
							characterDb.Name = value.Name;
							
							if (value.Level)
								characterDb.Level = value.Level;
							if (value.Race)
								characterDb.Race = value.Race;
							if (value.Class)
								characterDb.Class = value.Class;
							if (value.MaxHealth)
								characterDb.MaxHealth = value.MaxHealth;
							if (value.ArmorClass)
								characterDb.ArmorClass = value.ArmorClass;
							if (value.Notes)
								characterDb.Notes = value.Notes;


							await characterDb.save();
							return {
								"status": 201,
								"messages": ["success"]
							}
						} else {
							messages.push("Requester is not the owner.")
						}
					} else {
						messages.push("Character is not found.")
					}
					return {
						"status": 400,
						"messages": messages,
						"content": {},
					}
				}
			}
		);
	};
	public async Delete(request: {auth: any, params: any}) {
		const characterId = +request.params.characterId
		const messages: string[] = [];

		if (isNaN(characterId)) {
			messages.push("Parameter 'characterId' must be a number.")
		}

		if (messages.length == 0) {
			const characterDb = await Character.findOne<Character>({
				loadRelationIds: { relations: ['Creator'], disableMixedMap: true },
				where: { Id: characterId }
			});
			if (characterDb) {
				if (characterDb.Creator.Id == request.auth.credentials.id) {
					await characterDb.remove()
					return {
						"status": 201,
						"messages": ['success'],
					}
				} else {
					messages.push("Requester is not the owner.")
				}
			} else {
				messages.push("Character is not found.")
			}
		}
		return {
			"status": 400,
			"messages": messages,
		}
	};
	public async GetOne(request: {auth: any, params: any}) {
		const authInfo = request.auth;
		var characterId = +request.params.characterId;
		
		var messages: string[] = [];

		if (isNaN(characterId)) {
			messages.push("Parameter 'characterId' must be a number.")
		}

		if (messages.length == 0) {
			const characterDb = await Character.findOne<Character>({
				loadRelationIds: { relations: ['Creator', 'Campaigns'], disableMixedMap: true },
				where: { Id: characterId }
			});
			if (characterDb) {
				if (characterDb.Creator.Id == authInfo.credentials.id) {
					delete characterDb.Creator
					
					return {
						"status": 201,
						"messages": messages,
						"content": characterDb,
					}
				} else {
					messages.push("Requester is not the owner.")
				}
			} else {
				messages.push("Character is not found.")
			}
		}
		return {
			"status": 400,
			"messages": messages,
			"content": {},
		}
	};
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
			var allCharacters = await Character.find({
				where: {Creator : { Id: authInfo.credentials.id}},
			});

			var respond = allCharacters.slice(pageSize*pageNumber, pageSize*(pageNumber+1))

			return {
				"status": 201,
				"messages": messages,
				"content": respond,
				"total": allCharacters.length
			}
		} else {
			return {
				"status": 400,
				"messages": messages,
				"content": [],
				"total": 0
			}
		}
	};
}