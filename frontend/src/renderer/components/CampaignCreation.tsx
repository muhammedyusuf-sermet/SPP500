import * as React from 'react';
var request = require('request-promise-native');

// LEAVE THIS AS REQUIRE OR suffur from "TypeError: joi_1.default.string is not a function"
const Joi = require('joi');
import { ValidationError, ValidationOptions, ValidationErrorItem, Reference } from 'joi';

import 'bulma/css/bulma.css';
import { Modal, ModalContent, Box, ModalBackground, Button, Field, Control, Input, Title, Subtitle, Help } from 'bloomer';
import { Redirect } from "react-router-dom"
import { API_URL } from "../../config"
import { CookieManager } from "../../cookie";
////import { CampaignDetails } from './platform/pages/view_game_components/campaign/CampaignDetails';
//import { ICampaignState } from '../../campaign';
//import { stateWithoutErrors } from '../../utils/StateSelection';
import { Grid } from '@material-ui/core';

export interface IEncounterState{
	Id?: number
}

export interface ICampaignState{
	Id?: number;
	Name: string;
	Summary?: string;
	Notes?: string;
	Encounters?: IEncounterState[];
}

export enum CampaignCRUDState {
	Create = 'Create',
	Read = 'Read',
	Edit = 'Edit'
}

export interface ICampaignCRUDProps {
	Process: CampaignCRUDState;
	Id?: number;
}

export interface ICampaignCRUDState {
	Process: CampaignCRUDState;
	submitted: boolean;
	modal: {
		open: boolean;
		message: string;
	};
	Id?: number;
	Name: string;
	NameError?: string;	
	Summary?: string;
	SummaryError?: string;
	Notes?: string;
	NotesError?: string;
	Encounters?: IEncounterState[];
	EncountersError?: string;
}

interface ICampaignCRUDResponse {
	status: number,
	messages: string[]
}

export interface ICampaignGetOneResponse {
	status: number,
	messages: string[],
	content: ICampaignState,
}


export class CampaignCRUD extends React.Component<ICampaignCRUDProps, ICampaignCRUDState> {

	private payloadSchema = Joi.object({
		Id: Joi.number().greater(0),
		Name: Joi.string().required().max(50),
		Summary: Joi.string().max(1000),
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
	////private CampaignDetails: React.RefObject<CampaignDetails>;
	constructor(props: ICampaignCRUDProps) {
		super(props);
		this.state = {
			Process: props.Process,
			Id: props.Id,
			submitted: false,
			modal: {
				open: false,
				message: ""
			},
			Name: '',
		}
	}

	componentDidMount() {
		if (this.props.Process != CampaignCRUDState.Create){
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
							...body.content
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
					console.log("CampaignCRUD ERROR:")
					console.log(error)
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

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}
	
	handleCampaignNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let value = event.target.value;
		Joi.validate(
			value,
			Joi.reach(this.payloadSchema, ['Name']),
			this.validateOptions,
			(errors: ValidationError) => {
				this.setState({
					Name: value,
					NameError: errors ? errors.details[0].message : undefined
				});
		});
	}

	// TODO: Validate summary.
	handleCampaignSummaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let value = event.target.value;
		this.setState({  
			Summary: value
		})
	}
	
	// TODO: Validate notes.
	handleCampaignNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let value = event.target.value;
		this.setState({  
			Notes: value
		})
		console.log(this.state)
	}
	
	handleCampaignEncounterIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const encounters: {Id?: number}[] = []
		const  numberPattern = /\d+/g;
		const ids = event.target.value.match(numberPattern);
		if (ids != null) {
			ids.forEach((value: any) => {
				encounters.push({ Id: this.stringToNumber(value)})
			});
		}
		this.setState({  
			Encounters: encounters
		})
	}
	
	submitForm = (event: React.FormEvent) => {
		event.preventDefault();
		this.validateForm();
	}

	validateForm = async () => {
		
		const campaignPayload = {
			Id: this.state.Id,
			Name: this.state.Name,
			Summary: this.state.Summary,
			Notes: this.state.Notes,
			Encounters: this.state.Encounters ? this.state.Encounters.map((value) => ({ Id: value })) : []
		};

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
			if (this.state.Process == CampaignCRUDState.Create) {
				route += '/create';
			} else {//if (this.state.Process == CampaignCRUDState.Edit) {
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
						if (this.state.Process == CampaignCRUDState.Create) {
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



	// createCampaign = (event: React.FormEvent) => {
	// 	event.preventDefault();
	// 	this.saveCampaign();
	// }

	// saveCampaign = async (callback?: (message: string) => void) => {
	// 	// Gather the selected encounters for this campaign
	// 	//const checkedEncounterIds = [ ...this.state.checkedEncounters.keys() ];
	// 	//const selectedEncounters = encounters.filter(function(encounter){
	// 	//	return checkedEncounterIds.indexOf(encounter['Id']) > -1;
	// 	//});
	// 	const campaignDetailsState = this.CampaignDetails.current ? this.CampaignDetails.current.state : {};
	// 	const campaignPayload = {
	// 		Id: this.state.Id,
	// 		...this.stateWithoutErrors(campaignDetailsState)
	// 	};
	// }

	// cancel = (event: React.FormEvent) => {
	// 	event.preventDefault();
	// 	this.setState({ submitted: true});
	// }

	render() {
		return (
			(this.state.submitted && !this.state.modal.open) ? <Redirect to="/"/> :
			<div className="campaign-CRUD-container" > 
				<form onSubmit={this.submitForm}>
					<Grid container spacing={8} >
						<Grid item xs={12} >
							<Title className="page-title">{this.state.Process} a Campaign</Title>
						</Grid>
						<Grid item xs={12} >
							<Subtitle>Name</Subtitle>
							<Field>
								<Control>
									<Input
										disabled={this.state.Process == CampaignCRUDState.Read}
										id='Name'
										type='text'
										placeholder='Campaign Name'
										name='Name'
										value={this.state.Name}
										onChange={this.handleCampaignNameChange}
										required />
								</Control>
								<Help id='Name' isColor='danger'>{this.state.NameError}</Help>
							</Field>
						</Grid>
						<Grid item xs={12} >
							<Subtitle>Summary</Subtitle>
							<Field>
								<Control>
									<Input
										disabled={this.state.Process == CampaignCRUDState.Read}
										id='Summary'
										type='text'
										placeholder='Campaign Summary'
										value={this.state.Summary ? this.state.Summary : ''}
										onChange={this.handleCampaignSummaryChange}/>
								</Control>
								<Help id='Summary' isColor='danger'>{this.state.SummaryError}</Help>
							</Field>
						</Grid>
						<Grid item xs={12} >
							<Subtitle>Notes</Subtitle>
							<Field>
								<Control>
									<Input
										disabled={this.state.Process == CampaignCRUDState.Read}
										id='Notes'
										type='text'
										placeholder='Campaign Notes'
										value={this.state.Notes ? this.state.Notes : ''}
										onChange={this.handleCampaignNotesChange}/>
								</Control>
								<Help id='Notes' isColor='danger'>{this.state.NotesError}</Help>
							</Field>
						</Grid>
						
						<Grid item xs={12} >
							<Subtitle>Encounter Id</Subtitle>
							<Field>
								<Control>
									<Input
										disabled={this.state.Process == CampaignCRUDState.Read}
										id='Encounters'
										type='text'
										placeholder='1,2,3'
										value={this.state.Encounters ? this.state.Encounters.join(',') : ''}
										onChange={this.handleCampaignEncounterIdChange}/>
								</Control>
								<Help id='Encounters' isColor='danger'>{this.state.EncountersError}</Help>
							</Field>
						</Grid>
						{
							this.state.Process == CampaignCRUDState.Read ? null :
							<Field>
								<Button id='SubmitButton' isColor='primary' type="submit" isLoading={false}>{this.state.Process} Campaign</Button>
							</Field>
						}
						<Field>
							<Button id='BackButton' isColor='secondary' isLoading={false} onClick={()=>{
								history.back();
							}}>{this.state.Process == CampaignCRUDState.Read ? 'Back' : 'Cancel'}</Button>
						</Field>
					</Grid>
				</form>
					<Modal id='campaignCRUDModal' isActive={this.state.modal.open}>
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