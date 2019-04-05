import * as React from 'react';
var request = require('request-promise-native');

// LEAVE THIS AS REQUIRE OR suffur from "TypeError: joi_1.default.string is not a function"
const Joi = require('joi');
import { ValidationError, ValidationOptions, ValidationErrorItem } from 'joi';

import 'bulma/css/bulma.css';
import { Button, Control, Field, Modal, ModalContent, ModalBackground, Box} from 'bloomer';
import { Redirect } from "react-router-dom"
import { API_URL } from "../../config"
import { CookieManager } from "../../cookie";
import { CampaignDetails } from './platform/pages/view_game_components/campaign/CampaignDetails';

interface ICampaignResponse {
	status: number,
	messages: string[]
}

export interface ICampaignCreationState {
	submitted: boolean,
	modal: {
		open: boolean,
		message: string
	}
}

export class CampaignCreation extends React.Component<any, ICampaignCreationState> {
	private payloadSchema = Joi.object({
		Name: Joi.string().required().max(50),
		Summary: Joi.string().required().max(1000),
		Notes: Joi.string().max(2000),
		Encounters: Joi.array().items(Joi.object({
			Id: Joi.number().integer().greater(0).required().valid(Joi.ref('$EncounterOptions')).label('Encounter Id')
		})).default([])
	});
	private validateOptions: ValidationOptions = {
		abortEarly: false,
		convert: true,
		allowUnknown: false,
		context: {
			// TODO: Get the encounter IDs from database.
			EncounterOptions: [0,1,2,3,4,5,6,7,8,9,10,11]
		}
	};
	private CampaignDetails: React.RefObject<CampaignDetails>;
	constructor(props: any) {
		super(props);
		this.state = {
			submitted: false,
			modal: {
				open: false,
				message: ""
			}
		}
		this.CampaignDetails = React.createRef<CampaignDetails>();
	}

	openModal = (messageText: string) => {
		const modal = this.state.modal
		this.setState({ modal: {...modal, open: true, message: messageText }});
	};

	closeModal = () => {
		const modal = this.state.modal
		this.setState({ modal: {...modal, open: false }});
	};

	createCampaign = (event: React.FormEvent) => {
		event.preventDefault();
		this.saveCampaign();
	}
	private stateWithoutErrors(state: any): any
	{
		let newState: { [key: string]: number | string } = {};
		for (let field in state) {
			if (field.endsWith('Error'))
				continue
			if (state[field] != undefined)
				newState[field] = state[field];
		}
		return newState;
	}
	saveCampaign = async (callback?: (message: string) => void) => {
		// Gather the selected encounters for this campaign
		//const checkedEncounterIds = [ ...this.state.checkedEncounters.keys() ];
		//const selectedEncounters = encounters.filter(function(encounter){
		//	return checkedEncounterIds.indexOf(encounter['Id']) > -1;
		//});
		const campaignDetailsState = this.CampaignDetails.current ? this.CampaignDetails.current.state : {};
		const campaignPayload = {
			... this.stateWithoutErrors(campaignDetailsState)
		};
		let validationErrors = Joi.validate(
			campaignPayload,
			this.payloadSchema,
			this.validateOptions,
			(errors: ValidationError) => {
				if(errors){
					const messages: Set<string> = new Set<string>();
					errors.details.forEach((error: ValidationErrorItem) => {
						messages.add(error.message);
					});
					return Array.from(messages.values());
				}else{
					return undefined;
				}
			}
		);


		const options = { method: 'POST',
			url: API_URL + '/campaign/create',
			timeout: 2000,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json',
				'Authorization': CookieManager.UserToken('session_token')
			},
			body: campaignPayload,
			json: true
		};
		if (validationErrors) {
			// These errors are from validation and may be irrelevent or out of date.
			this.openModal(validationErrors.toString());
		} else {
			await request(options)
				.then((body: ICampaignResponse) => {
					if (body.status == 201) { // success
						this.openModal("Campaign successfully created.");
						this.setState({
							submitted: true
						});
					} else if (body.messages) {
						// TODO: change backend so it sends better error messages.
						// TODO: parse the error messages so they show better.
						// TODO: maybe the messages from the server shouldn't be
						// a list of strings but a JSON object so things are
						// grouped together. Easier to parse?
						this.openModal(body.messages.toString());
					}else{
						this.openModal("There was an error submitting your request. Please try again later.")
					}
				})
				.catch((error: string) => {
					this.openModal("There was an error sending your request.")
				})
		}
	}

	cancel = (event: React.FormEvent) => {
		event.preventDefault();
		this.setState({ submitted: true});
	}

	render() {
		return (
			(this.state.submitted && !this.state.modal.open) ? <Redirect to="/"/> :
			<div>
				<form id="createCampaignForm" onSubmit={this.createCampaign}>
					<CampaignDetails
						disabled={false}
						PayloadSchema={this.payloadSchema}
						ValidationOptions={this.validateOptions}
						ref={this.CampaignDetails}
						initial= {{
							//Name: undefined,
							//Summary: undefined,
							//Notes: undefined,
							//Encounters: undefined
							}}/>
					<Field isGrouped>
					    <Control>
					        <Button isColor='primary' type="submit">Submit</Button>
					    </Control>
					    <Control>
					        <Button id="cancel" isLink onClick={this.cancel}>Cancel</Button>
					    </Control>
					</Field>
				</form>
				<Modal id='campaignCreationModal' isActive={this.state.modal.open}>
					<ModalBackground id='modalBackground' onClick={()=>{
						this.closeModal();
					}}/>
					<ModalContent>
						<Box>
							<span id="ModalMessage">{this.state.modal.message}</span>
						</Box>
					</ModalContent>
				</Modal>
			</div>
		);
	}
}