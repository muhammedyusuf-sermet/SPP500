import * as React from 'react';
var request = require('request-promise-native');

import { API_URL } from "../../config"
// LEAVE THIS AS REQUIRE OR suffur from "TypeError: joi_1.default.string is not a function"
const Joi = require('joi');
import { ValidationError, ValidationOptions, ValidationErrorItem, Reference } from 'joi';

import 'bulma/css/bulma.css';
import { Modal, ModalContent, Box, ModalBackground, Field, Button } from 'bloomer';
import { Redirect } from "react-router-dom"
import { CookieManager } from "../../cookie";
import { CampaignDetails } from './platform/pages/view_game_components/campaign/CampaignDetails';
import { stateWithoutErrors } from '../../utils/StateSelection';
import { Typography } from '@material-ui/core';
import { ICampaignData } from '../../campaign';
import { CRUDProcess } from './MonsterCRUD';

export interface ICampaignCRUDProps {
	Process: CRUDProcess;
	Id?: number;
}

export interface ICampaignCRUDState {
	Process: CRUDProcess;
	Id?: number;
	submitted: boolean;
	modal: {
		open: boolean;
		message: string;
	};
	Campaign: ICampaignData;
}

interface ICampaignCRUDResponse {
	status: number,
	messages: string[]
}

export interface ICampaignGetOneResponse {
	status: number,
	messages: string[],
	content: ICampaignData,
}


export class CampaignCRUD extends React.Component<ICampaignCRUDProps, ICampaignCRUDState> {
	private payloadSchema = Joi.object({
		Id: Joi.number().greater(0).allow(0),
		Name: Joi.string().required().max(50).label("Name"),
		Summary: Joi.string().max(1000).label("Summary"),
		Notes: Joi.string().max(2000).label("Notes"),
		Encounters: Joi.array().items(Joi.object({
			Id: Joi.number().integer().greater(0).required().valid(Joi.ref('$EncounterOptions')).label('Encounter Id')
		})).default([]),
		Characters: Joi.array().items(Joi.object({
			Id: Joi.number().integer().greater(0).required().valid(Joi.ref('$CharacterOptions')).label('Encounter Id')
		})).default([])
	});
	private validateOptions: ValidationOptions = {
		abortEarly: false,
		convert: true,
		allowUnknown: false,
		context: {
			// TODO: Get the encounter IDs from database.
			EncounterOptions: [0,1,2,3,4,5,6,7,8,9,10,11],
			CharacterOptions: [0,1,2,3,4,5,6,7,8,9,10,11]
		}
	};
	private CampaignDetails: React.RefObject<CampaignDetails>;
	constructor(props: ICampaignCRUDProps) {
		super(props);

		this.CampaignDetails = React.createRef<CampaignDetails>();

		this.state = {
			Process: props.Process,
			Id: props.Id,
			submitted: false,
			modal: {
				open: false,
				message: ""
			},
			Campaign: {
				Name: '',
			}
		}
	}

	componentWillReceiveProps(nextProps: ICampaignCRUDProps) {
		if (nextProps.Process != CRUDProcess.Create && nextProps.Id != this.props.Id){
			const options = { method: 'GET',
				url: API_URL + '/campaign/' + nextProps.Id,
				headers:
				{
					'Cache-Control': 'no-cache',
					'Authorization': CookieManager.UserToken('session_token')
				},
				json: true
			};

			request(options)
				.then((body: ICampaignGetOneResponse) => {
					if (body.status == 201) { // success
						this.setState({
							Id: body.content.Id != undefined ? body.content.Id : -1,
							Campaign: body.content
						});
					} else if (body.messages) {
						// TODO: change backend so it sends better error messages.
						// TODO: parse the error messages so they show better.
						// TODO: maybe the messages from the server shouldn't be
						// a list of strings but a JSON object so things are
						// grouped together. Easier to parse?
						this.openModal("Error finding campaign: "+body.messages.toString());
					}else{
						this.openModal("There was an error retreiving the campaign. Please try again later.")
					}
				})
				.catch((error: string) => {
					this.openModal("There was an error sending your request.")
				})
		} else if (nextProps.Process != this.props.Process) {
			this.setState({
				Process: nextProps.Process
			});
		}
	}

	componentDidMount() {
		if (this.props.Process != CRUDProcess.Create){
			const options = { method: 'GET',
				url: API_URL + '/campaign/' + this.props.Id,
				headers:
				{
					'Cache-Control': 'no-cache',
					'Authorization': CookieManager.UserToken('session_token')
				},
				json: true
			};

			request(options)
				.then((body: ICampaignGetOneResponse) => {
					if (body.status == 201) { // success
						this.setState({
							Id: body.content.Id != undefined ? body.content.Id : -1,
							Campaign: body.content
						});
					} else if (body.messages) {
						// TODO: change backend so it sends better error messages.
						// TODO: parse the error messages so they show better.
						// TODO: maybe the messages from the server shouldn't be
						// a list of strings but a JSON object so things are
						// grouped together. Easier to parse?
						this.openModal("Error finding campaign: "+body.messages.toString());
					}else{
						this.openModal("There was an error retreiving the campaign. Please try again later.")
					}
				})
				.catch((error: string) => {
					this.openModal("There was an error sending your request.")
				})
		}
	}

	openModal = (messageText: string) => {
		const modal = this.state.modal
		this.setState({ modal: {...modal, open: true, message: messageText }});
	};

	closeModal = () => {
		const modal = this.state.modal
		this.setState({ modal: {...modal, open: false }});
	};

	submitForm = (event: React.FormEvent) => {
		event.preventDefault();
		this.validateForm();
	}

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	validateForm = async () => {
		const campaignState = this.CampaignDetails.current ? this.CampaignDetails.current.state : {};

		const campaignPayload = {
			Id: this.state.Id,
			...stateWithoutErrors(campaignState)
		};
		const encounters: {Id?: number}[] = []
		const numberPattern = /\d+/g;
		const encounterIds = campaignPayload.Encounters.match(numberPattern);
		if (encounterIds != null)
			encounterIds.forEach((value: any) => {
				encounters.push({ Id: this.stringToNumber(value)})
			});
		campaignPayload.Encounters = encounters
		
		const characters: {Id?: number}[] = []
		const characterIds = campaignPayload.Characters.match(numberPattern);
		if (characterIds != null)
			characterIds.forEach((value: any) => {
				characters.push({ Id: this.stringToNumber(value)})
			});
		campaignPayload.Characters = characters

		let validationErrors = Joi.validate(
			campaignPayload,
			this.payloadSchema,
			this.validateOptions,
			(errors: ValidationError) => {
				if(errors){
					const messages: Set<string> = new Set<string>();
					errors.details.forEach((error: ValidationErrorItem) => {
						let message: string = ''
						if ((error.type == 'any.allowOnly') && error.context && this.validateOptions) {
							for (let valid of error.context.valids){
								if (Joi.isRef(valid)){
									const reference = valid as Reference
									message += reference(null, this.validateOptions) + ',';
								}
							}
						}
						message = error.message.split('[')[0] + message.substr(0,message.length-1);
						messages.add(message);
					})
					return Array.from(messages.values());
				}else{
					return undefined;
				}
			}
		);

		if (validationErrors) {
			// These errors are from validation and may be irrelevent or out of date.
			this.openModal(validationErrors.toString());
		} else {
			let route = '/campaign';
			if (this.state.Process == CRUDProcess.Create) {
				route += '/create';
			} else {
				route += '/edit'
			}
			const options = { method: 'POST',
				url: API_URL + route,
				headers:
				{
					'Cache-Control': 'no-cache',
					'Content-Type': 'application/json' ,
					'Authorization': CookieManager.UserToken('session_token')
				},
				body: campaignPayload,
				json: true
			};
			await request(options)
				.then((body: ICampaignCRUDResponse) => {
					if (body.status == 201) { // success
						if (this.state.Process == CRUDProcess.Create) {
							this.openModal("Campaign successfully created.");
						} else {
							this.openModal("Campaign successfully updated.");
						}
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

	render() {
		return (
			(this.state.submitted && !this.state.modal.open) ? <Redirect to="/"/> :
			<div className="campaign-CRUD-container" >
				<Typography variant='h6' >{this.state.Process} a Campaign</Typography>
				<form onSubmit={this.submitForm}>
					<CampaignDetails
						ref={this.CampaignDetails}
						disabled={this.state.Process == CRUDProcess.Read}
						PayloadSchema={this.payloadSchema}
						ValidationOptions={this.validateOptions}
						initial={{
							...this.state.Campaign
						}} />
					{this.state.Process == CRUDProcess.Read ? null :
						<Field>
							<Button id='SubmitButton' isColor='primary' type="submit" isLoading={false}>{this.state.Process} Campaign</Button>
						</Field>
					}
					<Field>
						<Button id='BackButton' isColor='secondary' isLoading={false} onClick={()=>{
							history.back();
						}}>{this.state.Process == CRUDProcess.Read ? 'Back' : 'Cancel'}</Button>
					</Field>
				</form>
				<Modal id='CampaignCRUDModal' isActive={this.state.modal.open}>
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