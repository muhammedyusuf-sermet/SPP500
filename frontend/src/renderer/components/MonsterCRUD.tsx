import * as React from 'react';
var request = require('request-promise-native');

import { API_URL } from '../../config';
// LEAVE THIS AS REQUIRE OR suffur from "TypeError: joi_1.default.string is not a function"
const Joi = require('joi');
import { ValidationError, ValidationErrorItem, ValidationOptions, Reference } from 'joi';

import 'bulma/css/bulma.css';
import '../css/app.css';

import { Redirect } from "react-router-dom"
import { Modal, ModalContent, Box, ModalBackground, Button, Field, Control, Input, Title, Subtitle, FieldLabel, Label, FieldBody, Help } from 'bloomer';
import { MonsterType, MonsterRace, Size, Environment, Alignment, IMonsterState } from '../../monster';
import { CookieManager } from '../../cookie';
import { MonsterEnumConfiguration } from './platform/pages/view_catalog/monster/MonsterEnumConfiguration';
import { MonsterResistances } from './platform/pages/view_catalog/monster/MonsterResistances';
import { MonsterDefences } from './platform/pages/view_catalog/monster/MonsterDefences';
import { MonsterStats } from './platform/pages/view_catalog/monster/MonsterStats';
import { MonsterSkillBonuses } from './platform/pages/view_catalog/monster/MonsterSkillBonuses';
import { MonsterSpeedBonuses } from './platform/pages/view_catalog/monster/MonsterSpeedBonuses';
import { MonsterSenseBonuses } from './platform/pages/view_catalog/monster/MonsterSenseBonuses';
import { MonsterLanguages } from './platform/pages/view_catalog/monster/MonsterLanguages';
import { stateWithoutErrors } from '../../utils/StateSelection';
import { Grid, Tooltip } from '@material-ui/core';

export enum CRUDProcess {
	Create = 'Create',
	Read = 'Read',
	Edit = 'Edit'
}

export interface IMonsterCRUDProps {
	Process: CRUDProcess;
	Id?: number;
}

export interface IMonsterCRUDState {
	[key: string]: IMonsterState | CRUDProcess | number | boolean | {
		open: boolean;
		message: string;
	} | string | undefined;
	Process: CRUDProcess;
	Id?: number;
	submitted: boolean;
	modal: {
		open: boolean;
		message: string;
	};
	Name: string;
	NameError?: string;
	ChallengeRating?: number;
	ChallengeRatingError?: string;
	// TODO: Move experience points into the monster state when
	//  the backend server actually accepts it.
	ExperiencePoints?: number;
	ExperiencePointsError?: string;
	// Monster from the server request
	Monster: IMonsterState;
}

interface IMonsterCRUDResponse {
	status: number,
	messages: string[],
}

export interface IMonsterGetOneResponse {
	status: number,
	messages: string[],
	content: IMonsterState,
}

export class MonsterCRUD extends React.Component<IMonsterCRUDProps, IMonsterCRUDState> {
	private skillNames = [
		"Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight",
		"Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance",
		"Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival" ];
	private senseNames = [
		"Blind", "Blindsight", "Darkvision", "Tremorsense", "Truesight",
		"Passive Perception", "Passive Investigation", "Passive Insight" ];
	private payloadSchema = Joi.object({
		Id: Joi.number().integer().label('Id'),
		Name: Joi.string().required().max(50).label('Name'),
		Size: Joi.string().valid(Joi.ref('$SizeOptions')),
		Type: Joi.string().valid(Joi.ref('$TypeOptions')),
		Race: Joi.string().valid(Joi.ref('$RaceOptions')),
		Alignment: Joi.string().valid(Joi.ref('$AlignmentOptions')),
		Environment: Joi.string().valid(Joi.ref('$EnvironmentOptions')),
		ArmorClass: Joi.number().integer().greater(0).label('ArmorClass'),
		HitPoints: Joi.number().integer().greater(0).label('HitPoints'),
		// (rolls 'd' dice [+ - * /] operation) one or more times then rolls 'd' dice
		HitPointDistribution: Joi.string().max(20).regex(/^((\d+d\d+)[\+\-\*\/])*(\d+d\d+)([\+\-\*\/]\d+)?$/, '#d# OR (#d# operator (#d# or number)) NO spaces').label('HitPointDistribution'),
		Speed: Joi.string().max(100),
		Languages: Joi.string().allow('').max(100).label('Languages'),
		DamageVulnerabilities: Joi.string().allow('').max(200).label('DamageVulnerabilities'),
		DamageResistances: Joi.string().allow('').max(200).label('DamageResistances'),
		DamageImmunities: Joi.string().allow('').max(200).label('DamageImmunities'),
		ConditionImmunities: Joi.string().allow('').max(200).label('ConditionImmunities'),
		ChallengeRating: Joi.number().greater(0).label('ChallengeRating'),
		AbilityScores: Joi.object({
			Strength: Joi.number().integer().greater(0).label('Strength'),
			Dexterity: Joi.number().integer().greater(0).label('Dexterity'),
			Constitution: Joi.number().integer().greater(0).label('Constitution'),
			Intelligence: Joi.number().integer().greater(0).label('Intelligence'),
			Wisdom: Joi.number().integer().greater(0).label('Wisdom'),
			Charisma: Joi.number().integer().greater(0).label('Charisma')
		}).default({}),
		SavingThrows: Joi.object({
			Strength: Joi.number().integer().label('Strength'),
			Dexterity: Joi.number().integer().label('Dexterity'),
			Constitution: Joi.number().integer().label('Constitution'),
			Intelligence: Joi.number().integer().label('Intelligence'),
			Wisdom: Joi.number().integer().label('Wisdom'),
			Charisma: Joi.number().integer().label('Charisma')
		}).default({}),
		Skills: Joi.object().pattern(
			Joi.symbol().valid(this.skillNames),
			Joi.number().integer().greater(0).allow(0)
		).default({}),
		Senses: Joi.object().pattern(
			Joi.symbol().valid(this.senseNames),
			Joi.number().integer().greater(0).allow(0)
		).default({}),
		Actions: Joi.array().items(Joi.object({
			Name: Joi.string().required().max(50),
			Description: Joi.string().required().max(250),
			HitBonus: Joi.number().integer().greater(0).allow(0),
			Damage: Joi.string().max(20).regex(/^(\ *(\d+d\d+)\ *[\+\-\*\/]\ *)*(\ *(\d+d\d+))\ *(\+\d+)?$/, 'range'),
			DamageBonus: Joi.number().integer().greater(0).allow(0),
			Type: Joi.string().valid(Joi.ref('$ActionOptions'))
		}).label('Action Items')).default([])
	});
	private validateOptions: ValidationOptions = {
		abortEarly: false,
		convert: true,
		allowUnknown: false,
		context: {
			SizeOptions: Object.keys(Size),
			TypeOptions: Object.keys(MonsterType),
			RaceOptions: Object.keys(MonsterRace),
			AlignmentOptions: Object.keys(Alignment),
			EnvironmentOptions: Object.keys(Environment),
			SkillOptions: this.skillNames,
			SenseOptions: this.senseNames
		}
	};
	private EnumConfiguration: React.RefObject<MonsterEnumConfiguration>;
	private Resistances: React.RefObject<MonsterResistances>;
	private Defences: React.RefObject<MonsterDefences>;
	private AbilityScores: React.RefObject<MonsterStats>;
	private SavingThrows: React.RefObject<MonsterStats>;
	private SkillBonuses: React.RefObject<MonsterSkillBonuses>;
	private SpeedBonuses: React.RefObject<MonsterSpeedBonuses>;
	private SenseBonuses: React.RefObject<MonsterSenseBonuses>;
	private Languages: React.RefObject<MonsterLanguages>;
	constructor(props: IMonsterCRUDProps) {
		super(props);

		this.EnumConfiguration = React.createRef<MonsterEnumConfiguration>();
		this.Resistances = React.createRef<MonsterResistances>();
		this.Defences = React.createRef<MonsterDefences>();
		this.AbilityScores = React.createRef<MonsterStats>();
		this.SavingThrows = React.createRef<MonsterStats>();
		this.SkillBonuses = React.createRef<MonsterSkillBonuses>();
		this.SpeedBonuses = React.createRef<MonsterSpeedBonuses>();
		this.SenseBonuses = React.createRef<MonsterSenseBonuses>();
		this.Languages = React.createRef<MonsterLanguages>();

		this.state = {
			Process: props.Process,
			Id: props.Id,
			submitted: false,
			modal: {
				open: false,
				message: '',
			},
			Name: '',
			// Monster data fields
			Monster: {
				Name: '',
				AbilityScores: {},
				SavingThrows: {},
				Skills: {},
				Senses: {}
			}
		};
	}

	shouldComponentUpdate(nextProps: IMonsterCRUDProps, nextState: IMonsterCRUDState) {
		for (let key in nextState)
			if (this.state[key] != nextState[key])
				return true
		return false
	}

	componentWillReceiveProps(nextProps: IMonsterCRUDProps) {
		if (nextProps.Process != CRUDProcess.Create && nextProps.Id != this.props.Id){
			const options = { method: 'GET',
				url: API_URL + '/monster/' + nextProps.Id,
				headers:
				{
					'Cache-Control': 'no-cache',
					'Authorization': CookieManager.UserToken('session_token')
				},
				json: true
			};

			request(options)
				.then((body: IMonsterGetOneResponse) => {
					if (body.status == 201) { // success
						this.setState({
							Id: body.content.Id != undefined ? body.content.Id : -1,
							Name: body.content.Name,
							ChallengeRating: body.content.ChallengeRating,
							Monster: body.content
						});
					} else if (body.messages) {
						// TODO: change backend so it sends better error messages.
						// TODO: parse the error messages so they show better.
						// TODO: maybe the messages from the server shouldn't be
						// a list of strings but a JSON object so things are
						// grouped together. Easier to parse?
						this.openModal("Error finding monster: "+body.messages.toString());
					}else{
						this.openModal("There was an error retreiving the monster. Please try again later.")
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
				url: API_URL + '/monster/' + this.props.Id,
				headers:
				{
					'Cache-Control': 'no-cache',
					'Authorization': CookieManager.UserToken('session_token')
				},
				json: true
			};

			request(options)
				.then((body: IMonsterGetOneResponse) => {
					if (body.status == 201) { // success
						this.setState({
							Id: body.content.Id != undefined ? body.content.Id : -1,
							Name: body.content.Name,
							ChallengeRating: body.content.ChallengeRating,
							Monster: body.content
						});
					} else if (body.messages) {
						// TODO: change backend so it sends better error messages.
						// TODO: parse the error messages so they show better.
						// TODO: maybe the messages from the server shouldn't be
						// a list of strings but a JSON object so things are
						// grouped together. Easier to parse?
						this.openModal("Error finding monster: "+body.messages.toString());
					}else{
						this.openModal("There was an error retreiving the monster. Please try again later.")
					}
				})
				.catch((error: string) => {
					this.openModal("There was an error sending your request.")
				})
		}
	}

	openModal = (messageText: string) => {
		const modal = this.state.modal;
		this.setState({ modal: {...modal, open: true, message: messageText }});
	};

	closeModal = () => {
		const modal = this.state.modal;
		this.setState({ modal: {...modal, open: false }});
	};

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	stringToFloat = (toConvert : string) => {
		return toConvert == '' ? undefined : parseFloat(toConvert);
	}

	handleMonsterNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
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

	handleMonsterChallengeRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = this.stringToFloat(event.target.value);
		Joi.validate(
			value,
			Joi.reach(this.payloadSchema, ['ChallengeRating']),
			this.validateOptions,
			(errors: ValidationError) => {
				this.setState({
					ChallengeRating: value,
					ChallengeRatingError: errors ? errors.details[0].message : undefined
				});
			});
	}

	handleMonsterExperiencePointsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// TODO: validate experience points
		this.setState({
			ExperiencePoints: this.stringToNumber(event.target.value)
		})
	}

	/* TODO / Update in future sprint to add abilities and actions
	handleMonsterAbilitiesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, name: event.target.value }
		})
	}

	handleMonsterActionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, name: event.target.value }
		})
	}
	*/

	submitForm = (event: React.FormEvent) => {
		event.preventDefault();
		this.validateForm();
	}

	validateForm = async () => {
		const enumState = this.EnumConfiguration.current ? this.EnumConfiguration.current.state : {};
		const resistancesState = this.Resistances.current ? this.Resistances.current.state : {};
		const defencesState = this.Defences.current ? this.Defences.current.state : {};
		const abilityScoreState = this.AbilityScores.current ? this.AbilityScores.current.state : {};
		const savingThrowState = this.SavingThrows.current ? this.SavingThrows.current.state : {};
		const skillBonusesState = this.SkillBonuses.current ? this.SkillBonuses.current.state : {};
		const speedBonusesState = this.SpeedBonuses.current ? this.SpeedBonuses.current.state : {};
		const senseBonusesState = this.SenseBonuses.current ? this.SenseBonuses.current.state : {};
		const languagesState = this.Languages.current ? this.Languages.current.state : {};

		// need to convert speed to single string
		let monsterSpeed: string|undefined = speedBonusesState.SpeedLand ? speedBonusesState.SpeedLand + "ft." : ""
		monsterSpeed = speedBonusesState.SpeedSwim ? monsterSpeed + " Swimming Speed: " + speedBonusesState.SpeedSwim + " ft." : monsterSpeed
		if(monsterSpeed.length == 0)
			monsterSpeed = undefined;
		let monsterPayload: IMonsterState = {
			Id: this.state.Id,
			Name: this.state.Name,
			ChallengeRating: this.state.ChallengeRating,
			...stateWithoutErrors(enumState),
			Speed: monsterSpeed,
			...stateWithoutErrors(resistancesState),
			...stateWithoutErrors(defencesState),
			...stateWithoutErrors(languagesState),
			AbilityScores: {
				...stateWithoutErrors(abilityScoreState)
			},
			SavingThrows: {
				...stateWithoutErrors(savingThrowState)
			},
			Skills: {
				...stateWithoutErrors(skillBonusesState)
			},
			Senses: {
				...stateWithoutErrors(senseBonusesState)
			}
		}

		let validationErrors = Joi.validate(
			monsterPayload,
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
			let route = '/monster';
			if (this.state.Process == CRUDProcess.Create) {
				route += '/create';
			} else {//if (this.state.Process == MonsterCRUDState.Edit) {
				route += '/edit'
			}
			var options = { method: 'POST',
				url: API_URL + route,
				headers:
				{
					'Cache-Control': 'no-cache',
					'Content-Type': 'application/json' ,
					'Authorization': CookieManager.UserToken('session_token')
				},
				body: monsterPayload,
				json: true
			};
			await request(options)
				.then((body: IMonsterCRUDResponse) => {
					if (body.status == 201) { // success
						if (this.state.Process == CRUDProcess.Create) {
							this.openModal("Monster successfully created.");
						} else {
							this.openModal("Monster successfully updated.");
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
			<div className="monster-CRUD-container">
				<form onSubmit={this.submitForm}>
				<Grid container spacing={8} >
					<Grid item xs={12} >
						<Title className="page-title">{this.state.Process} a Monster</Title>
					</Grid>
					<Grid item xs={12} >
						<Subtitle>Monster Name</Subtitle>
						<Field>
							<Control>
								<Input
									disabled={this.state.Process == CRUDProcess.Read}
									id='Name'
									type='text'
									placeholder='Monster Name'
									autoComplete='Name'
									name='Name'
									value={this.state.Name}
									onChange={this.handleMonsterNameChange}
									required />
							</Control>
							<Help id='Name' isColor='danger'>{this.state.NameError}</Help>
						</Field>
					</Grid>
					<Grid item xs={12} >
					<MonsterEnumConfiguration
						disabled={this.state.Process == CRUDProcess.Read}
						PayloadSchema={this.payloadSchema}
						ValidationOptions={this.validateOptions}
						ref={this.EnumConfiguration}
						initial= {{
							Size: this.state.Monster.Size,
							Type: this.state.Monster.Type,
							Race: this.state.Monster.Race,
							Alignment: this.state.Monster.Alignment,
							Environment: this.state.Monster.Environment
						}} />
					</Grid>
					<Grid item xs={12} >
					<MonsterResistances
						disabled={this.state.Process == CRUDProcess.Read}
						PayloadSchema={this.payloadSchema}
						ValidationOptions={this.validateOptions}
						ref={this.Resistances}
						initial={{
							DamageResistances: this.state.Monster.DamageResistances,
							DamageImmunities: this.state.Monster.DamageImmunities,
							DamageVulnerabilities: this.state.Monster.DamageVulnerabilities,
							ConditionImmunities: this.state.Monster.ConditionImmunities
						}} />
					</Grid>
					<Grid item xs={12} >
					<MonsterDefences
						disabled={this.state.Process == CRUDProcess.Read}
						PayloadSchema={this.payloadSchema}
						ValidationOptions={this.validateOptions}
						ref={this.Defences}
						initial={{
							ArmorClass: this.state.Monster.ArmorClass,
							HitPoints: this.state.Monster.HitPoints,
							HitPointDistribution: this.state.Monster.HitPointDistribution
						}} />
					</Grid>
					<Grid item xs={12} >
					<MonsterSpeedBonuses
						disabled={this.state.Process == CRUDProcess.Read}
						// TODO: use validation for speeds
						//PayloadSchema={this.payloadSchema}
						//ValidationOptions={this.validateOptions}
						ref={this.SpeedBonuses}
						initial={{
							// TODO: parse the speed string into SpeedLand and SpeedSwim
						}} />
					</Grid>
					<Grid item xs={12} sm={6} >
						<MonsterStats
							disabled={this.state.Process == CRUDProcess.Read}
							PayloadSchema={this.payloadSchema}
							ValidationOptions={this.validateOptions}
							ref={this.AbilityScores}
							Parent={'AbilityScores'}
							initial={{
								...this.state.Monster.AbilityScores
							}} />
					</Grid>
					<Grid item xs={12} sm={6} >
						<MonsterStats
							disabled={this.state.Process == CRUDProcess.Read}
							PayloadSchema={this.payloadSchema}
							ValidationOptions={this.validateOptions}
							ref={this.SavingThrows}
							Parent={'SavingThrows'}
							initial={{
								...this.state.Monster.SavingThrows
							}} />
					</Grid>
					<Grid item xs={12} >
					<MonsterSkillBonuses
						disabled={this.state.Process == CRUDProcess.Read}
						PayloadSchema={this.payloadSchema}
						ValidationOptions={this.validateOptions}
						ref={this.SkillBonuses}
						initial={{
							...this.state.Monster.Skills
						}} />
					</Grid>
					<Grid item xs={12} >
					<MonsterSenseBonuses
						disabled={this.state.Process == CRUDProcess.Read}
						PayloadSchema={this.payloadSchema}
						ValidationOptions={this.validateOptions}
						ref={this.SenseBonuses}
						initial={{
							...this.state.Monster.Senses
						}} />
					</Grid>
					<Grid item xs={12} >
						<Subtitle>Final Touches</Subtitle>
						<MonsterLanguages
							disabled={this.state.Process == CRUDProcess.Read}
							PayloadSchema={this.payloadSchema}
							ValidationOptions={this.validateOptions}
							ref={this.Languages}
							initial={{
								Languages: this.state.Monster.Languages
							}} />
							<Help>Specify the languages that your monster is fluent in.</Help>
						<Field isHorizontal>
							<FieldLabel isNormal>
								<Label>Challenge Rating</Label>
							</FieldLabel>
							<FieldBody>
								<Field>
									<Control>
										<Input
											disabled={this.state.Process == CRUDProcess.Read}
											id='ChallengeRating'
											type='number'
											placeholder='Challenge Rating'
											autoComplete='ChallengeRating'
											value={this.state.ChallengeRating != undefined ? this.state.ChallengeRating : ''}
											name='ChallengeRating'
											onChange={this.handleMonsterChallengeRatingChange} />
									</Control>
									<Help isColor='danger'>{this.state.ChallengeRatingError}</Help>
									<Tooltip disableFocusListener title={"Challenge Rating is a rating that is given to creatures, traps and certain other events and is used as an estimate of how dangerous that particular encounter is. Challenge Rating assumes that a party of a Fighter, a Cleric, a Wizard and a Rogue with an average level equal to the Challenge Rating will expend approximately 25% of their expendable resources during the encounter."}>
										<Help className="tooltip">Hover for More About Challenge Rating</Help>
								</Tooltip>
								</Field>
							</FieldBody>
						</Field>
						<Field isHorizontal>
							<FieldLabel isNormal>
								<Label>Experience Points</Label>
							</FieldLabel>
							<FieldBody>
								<Field>
									<Control>
										<Input
											disabled={this.state.Process == CRUDProcess.Read}
											id='ExperiencePoints'
											type='number'
											placeholder='Experience Points'
											autoComplete='ExperiencePoints'
											value={this.state.ExperiencePoints != undefined ? this.state.ExperiencePoints : ''}
											onChange={this.handleMonsterExperiencePointsChange} />
									</Control>
									<Help isColor='danger'>{this.state.ExperiencePointsError}</Help>
									<Help>The experience points that should be awarded to the party for defeating this monster.</Help>
								</Field>
							</FieldBody>
						</Field>
					</Grid>
					{
						this.state.Process == CRUDProcess.Read ? null :
						<Field>
							<Button id='SubmitButton' isColor='primary' type="submit" isLoading={false}>{this.state.Process} Monster</Button>
						</Field>
					}
					<Field>
						{
							// TODO The back or cancel button shouldn't really be part of
							//  this component Something else should be handling back
							//  functionality so then this component can be used in more places.
						}
						<Button id='BackButton' isColor='secondary' isLoading={false} onClick={()=>{
							history.back();
						}}>{this.state.Process == CRUDProcess.Read ? 'Back' : 'Cancel'}</Button>
					</Field>
					</Grid>
				</form>
				<Modal id='monsterCRUDModal' isActive={this.state.modal.open}>
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
