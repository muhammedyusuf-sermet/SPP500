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
import { CharacterDetails } from './platform/pages/view_game_components/character/CharacterDetails';
//import { stateWithoutErrors } from '../../utils/StateSelection';
import { Typography } from '@material-ui/core';
import { ICharacterData, CharacterRace, CharacterClass } from '../../character';

export enum CharacterCRUDProcess {
	Create = 'Create',
	Read = 'Read',
	Edit = 'Edit'
}

export interface ICharacterCRUDProps {
	Process: CharacterCRUDProcess;
	Id?: number;
}

export interface ICharacterCRUDState {
	[key: string]: ICharacterData | CharacterCRUDProcess | number | boolean | {
		open: boolean;
		message: string;
	} | string | undefined;
	Process: CharacterCRUDProcess;
	Id?: number;
	submitted: boolean;
	modal: {
		open: boolean;
		message: string;
	};
	Character: ICharacterData;
}

interface ICharacterCRUDResponse {
	status: number,
	messages: string[]
}

export interface ICharacterGetOneResponse {
	status: number,
	messages: string[],
	content: ICharacterData,
}

export class CharacterCRUD extends React.Component<ICharacterCRUDProps, ICharacterCRUDState> {
	private payloadSchema = Joi.object({
		Id: Joi.number().greater(0).allow(0).label('Id'),
		Name: Joi.string().required().max(50).label("Name"),
		Level: Joi.number().integer().greater(0).label("Level"),
		Race: Joi.string().valid(Joi.ref('$RaceOptions')),
		Class: Joi.string().valid(Joi.ref('$ClassOptions')),
		MaxHealth: Joi.number().integer().greater(0).label('MaxHealth'),
		ArmorClass: Joi.number().integer().greater(0).label('ArmorClass'),
		Notes: Joi.string().max(1000).label("Notes"),
		Campaigns: Joi.array().items(Joi.object({
			Id: Joi.number().integer().greater(0).required().valid(Joi.ref('$CampaignOptions')).label('Campaign Id')
		})).default([])
	});
	private validateOptions: ValidationOptions = {
		abortEarly: false,
		convert: true,
		allowUnknown: false,
		context: {
			RaceOptions: Object.keys(CharacterRace),
			ClassOptions: Object.keys(CharacterClass)
		}
	};
	private CharacterDetails: React.RefObject<CharacterDetails>;
	constructor(props: ICharacterCRUDProps) {
		super(props);

		this.CharacterDetails = React.createRef<CharacterDetails>();

		this.state = {
			Process: props.Process,
			Id: props.Id,
			submitted: false,
			modal: {
				open: false,
				message: ""
			},
			Character: {
				Name: '',
			}
		}
	}

	shouldComponentUpdate(nextProps: ICharacterCRUDProps, nextState: ICharacterCRUDState) {
		for (let key in nextState)
			if (this.state[key] != nextState[key])
				return true
		return false
	}

	componentWillReceiveProps(nextProps: ICharacterCRUDProps) {
		if (nextProps.Process != CharacterCRUDProcess.Create && nextProps.Id != this.props.Id){
			const options = { method: 'GET',
				url: API_URL + '/character/' + nextProps.Id,
				headers:
				{
					'Cache-Control': 'no-cache',
					'Authorization': CookieManager.UserToken('session_token')
				},
				json: true
			};

			request(options)
				.then((body: ICharacterGetOneResponse) => {
					if (body.status == 201) { // success
						this.setState({
							Id: body.content.Id != undefined ? body.content.Id : -1,
							Character: body.content
						});
					} else if (body.messages) {
						// TODO: change backend so it sends better error messages.
						// TODO: parse the error messages so they show better.
						// TODO: maybe the messages from the server shouldn't be
						// a list of strings but a JSON object so things are
						// grouped together. Easier to parse?
						this.openModal("Error finding character: "+body.messages.toString());
					}else{
						this.openModal("There was an error retreiving the character. Please try again later.")
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
		if (this.props.Process != CharacterCRUDProcess.Create){
			const options = { method: 'GET',
				url: API_URL + '/character/' + this.props.Id,
				headers:
				{
					'Cache-Control': 'no-cache',
					'Authorization': CookieManager.UserToken('session_token')
				},
				json: true
			};

			request(options)
				.then((body: ICharacterGetOneResponse) => {
					if (body.status == 201) { // success
						this.setState({
							Id: body.content.Id != undefined ? body.content.Id : -1,
							Character: body.content
						});
					} else if (body.messages) {
						// TODO: change backend so it sends better error messages.
						// TODO: parse the error messages so they show better.
						// TODO: maybe the messages from the server shouldn't be
						// a list of strings but a JSON object so things are
						// grouped together. Easier to parse?
						this.openModal("Error finding character: "+body.messages.toString());
					}else{
						this.openModal("There was an error retreiving the character. Please try again later.")
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

	validateForm = async () => {
		const characterPayload: ICharacterData = {
			Id: this.state.Id,
			...(this.CharacterDetails.current ? this.CharacterDetails.current.GetData() : { Name: '' }),
		}

		let validationErrors = Joi.validate(
			characterPayload,
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
			let route = '/character';
			if (this.state.Process == CharacterCRUDProcess.Create) {
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
				body: characterPayload,
				json: true
			};
			await request(options)
				.then((body: ICharacterCRUDResponse) => {
					if (body.status == 201) { // success
						if (this.state.Process == CharacterCRUDProcess.Create) {
							this.openModal("Character successfully created.");
						} else {
							this.openModal("Character successfully updated.");
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
			<div className="character-CRUD-container" >
				<Typography variant='h6' >{this.state.Process} a Character</Typography>
				<form onSubmit={this.submitForm}>
					<CharacterDetails
						ref={this.CharacterDetails}
						disabled={this.state.Process == CharacterCRUDProcess.Read}
						PayloadSchema={this.payloadSchema}
						ValidationOptions={this.validateOptions}
						Character={{
							...this.state.Character
						}} />
					{this.state.Process == CharacterCRUDProcess.Read ? null :
						<Field>
							<Button id='SubmitButton' isColor='primary' type="submit" isLoading={false}>{this.state.Process} Character</Button>
						</Field>
					}
					<Field>
						<Button id='BackButton' isColor='secondary' isLoading={false} onClick={()=>{
							history.back();
						}}>{this.state.Process == CharacterCRUDProcess.Read ? 'Back' : 'Cancel'}</Button>
					</Field>
				</form>
				<Modal id='characterCRUDModal' isActive={this.state.modal.open}>
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