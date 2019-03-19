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

export class CampaignFactory {
	private payloadSchema = Joi.object({
		Name: Joi.string().required().max(50),
		Summary: Joi.string().required().max(1000),
		Notes: Joi.string().max(2000),
		Encounters: Joi.array().items(Joi.object({
			Id: Joi.number().integer().greater(0).required().valid(Joi.ref('$EncounterOptions')).label('Encounter Id')
		})).default([])
	});
	public async Create(request: {payload: any, auth: any}) {
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
}