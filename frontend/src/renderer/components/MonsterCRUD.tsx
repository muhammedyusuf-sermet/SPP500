import * as React from 'react';
var request = require('request-promise-native');

import { API_URL } from '../../config';
// LEAVE THIS AS REQUIRE OR suffur from "TypeError: joi_1.default.string is not a function"
const Joi = require('joi');
import { ValidationError, ValidationErrorItem, ValidationOptions, Reference } from 'joi';

import 'bulma/css/bulma.css';

import {Redirect} from "react-router-dom"
import { Modal, ModalContent, Box, ModalBackground, Button, Tile, Field, Control, Input, Title, Subtitle, FieldLabel, Label, FieldBody, Help } from 'bloomer';
import { MonsterType, MonsterRace, Size, Environment, Alignment, IMonsterState, IMonsterErrorState } from '../../monster';
import { CookieManager } from '../../cookie';
import { MonsterEnumConfiguration } from './platform/pages/view_catalog/monster/MonsterEnumConfiguration';
import { MonsterResistances } from './platform/pages/view_catalog/monster/MonsterResistances';
import { MonsterDefences } from './platform/pages/view_catalog/monster/MonsterDefences';
import { MonsterStats } from './platform/pages/view_catalog/monster/MonsterStats';
import { MonsterSkillBonuses } from './platform/pages/view_catalog/monster/MonsterSkillBonuses';
import { MonsterSpeedBonuses } from './platform/pages/view_catalog/monster/MonsterSpeedBonuses';
import { MonsterSenseBonuses } from './platform/pages/view_catalog/monster/MonsterSenseBonuses';

export interface IMonsterCreationProps {
	defaultMonster?: IMonsterState
}

export interface IMonsterCreationState {
	monster: IMonsterState,
	monsterErrors: IMonsterErrorState,
	SpeedLand?: number,
	SpeedSwim?: number,
	ExperiencePoints?: number,
	submitted: boolean,
	modal: {
		open: boolean,
		message: string
	}
}

interface IMonsterCreationResponse {
	status: number,
	messages: string[],
}

export class MonsterCreation extends React.Component<IMonsterCreationProps, IMonsterCreationState> {
	// TODO move skillNames, senseNames, abilityScoreNames, savingThrowNames to the monster file.
	private skillNames = [
		"Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight",
		"Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance",
		"Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival" ];
	private senseNames = [
		"Blind", "Blindsight", "Darkvision", "Tremorsense", "Truesight",
		"Passive Perception", "Passive Investigation", "Passive Insight" ];
	private payloadSchema = Joi.object({
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
		Languages: Joi.string().max(100).label('Languages'),
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
		/* This is how to send skills as a dictionary. */
		Skills: Joi.object().pattern(
			Joi.symbol().valid(this.skillNames),
			Joi.number().integer().greater(0).allow(0)
		).default({}),
		/* This is how to send skills as an array of objects.
		Skills: Joi.array().items(Joi.object({
			Name: Joi.string().required().valid(Joi.ref('$SkillOptions')).label('Skill Name'),
			Bonus: Joi.number().integer().greater(0).allow(0).required().label('Skill Bonus')
		})).default([]),*/
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
	constructor(props: IMonsterCreationProps) {
		super(props);
		this.state = {
			submitted: false,
			modal: {
				open: false,
				message: ""
			},
			monster: props.defaultMonster == undefined ? {
				Name: '',
				AbilityScores: {},
				SavingThrows: {},
				Senses: {},
				Skills: {},
			} : props.defaultMonster,
			monsterErrors: {
				AbilityScores: {},
				SavingThrows: {},
				Skills: {},
				Senses: {}
			}
		};
		this.EnumConfiguration = React.createRef<MonsterEnumConfiguration>();
		this.Resistances = React.createRef<MonsterResistances>();
		this.Defences = React.createRef<MonsterDefences>();
		this.AbilityScores = React.createRef<MonsterStats>();
		this.SavingThrows = React.createRef<MonsterStats>();
		this.SkillBonuses = React.createRef<MonsterSkillBonuses>();
		this.SpeedBonuses = React.createRef<MonsterSpeedBonuses>();
		this.SenseBonuses = React.createRef<MonsterSenseBonuses>();
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

	handleBaseMonsterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { monster, monsterErrors } = this.state
		Joi.validate(
			event.target.value,
			Joi.reach(this.payloadSchema, [event.currentTarget.name]),
			this.validateOptions,
			(errors: ValidationError, value: any) => {
				this.setState({
					monster: { ...monster, [event.currentTarget.name]: event.target.value },
					monsterErrors: { ...monsterErrors, [event.currentTarget.name]: errors ? errors.details[0].message : undefined}
				});
			});
	}

	handleMonsterFloatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { monster, monsterErrors } = this.state
		const value = this.stringToFloat(event.target.value);
		Joi.validate(
			value,
			Joi.reach(this.payloadSchema, [event.currentTarget.name]),
			this.validateOptions,
			(errors: ValidationError) => {
				this.setState({
					monster: { ...monster, [event.currentTarget.name]: value },
					monsterErrors: { ...monsterErrors, [event.currentTarget.name]: errors ? errors.details[0].message : undefined}
				});
			});
	}

	handleMonsterExperiencePointsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

	validateForm = async (event: React.FormEvent) => {
		event.preventDefault();
		const enumState = this.EnumConfiguration.current ? this.EnumConfiguration.current.state : {};
		const resistancesState = this.Resistances.current ? this.Resistances.current.state : {};
		const defencesState = this.Defences.current ? this.Defences.current.state : {};
		const abilityScoreState = this.AbilityScores.current ? this.AbilityScores.current.state : {};
		const savingThrowState = this.SavingThrows.current ? this.SavingThrows.current.state : {};
		const skillBonusesState = this.SkillBonuses.current ? this.SkillBonuses.current.state : {};
		const speedBonusesState = this.SpeedBonuses.current ? this.SpeedBonuses.current.state : {};
		const senseBonusesState = this.SenseBonuses.current ? this.SenseBonuses.current.state : {};

		// need to convert speed to single string
		let monsterSpeed: string|undefined = speedBonusesState.SpeedLand ? speedBonusesState.SpeedLand + "ft." : ""
		monsterSpeed = speedBonusesState.SpeedSwim ? monsterSpeed + " Swimming Speed: " + speedBonusesState.SpeedSwim + " ft." : monsterSpeed
		if(monsterSpeed.length == 0)
			monsterSpeed = undefined;
		const monsterPayload: IMonsterState = {
			//...this.state.monster,
			Name: this.state.monster.Name,
			Languages: this.state.monster.Languages,
			ChallengeRating: this.state.monster.ChallengeRating,
			...this.stateWithoutErrors(enumState),
			Speed: monsterSpeed,
			...this.stateWithoutErrors(resistancesState),
			...this.stateWithoutErrors(defencesState),
			AbilityScores: {
				...this.stateWithoutErrors(abilityScoreState)
			},
			SavingThrows: {
				...this.stateWithoutErrors(savingThrowState)
			},
			Skills: {
				...this.stateWithoutErrors(skillBonusesState)
			},
			Senses: {
				...this.stateWithoutErrors(senseBonusesState)
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
			var options = { method: 'POST',
				url: API_URL + '/monster/create',
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
				.then((body: IMonsterCreationResponse) => {
					if (body.status == 201) { // success
						this.openModal("Monster successfully created.");
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
			<div className="monster-creation-container">
				<form onSubmit={this.validateForm}>
					<Tile isParent isVertical>
					<Title className="page-title">Create a Monster</Title>
					<Tile className="box" isVertical>
						<Subtitle>Monster Name</Subtitle>
						<Field>
							<Control>
								<Input
									id='Name'
									type='text'
									placeholder='Monster Name'
									autoComplete='Name'
									name='Name'
									value={this.state.monster.Name}
									onChange={this.handleBaseMonsterChange}
									required />
							</Control>
							<Help isColor='danger'>{this.state.monsterErrors.Name}</Help>
						</Field>
					</Tile>
					<MonsterEnumConfiguration
						disabled={false}
						PayloadSchema={this.payloadSchema}
						ValidationOptions={this.validateOptions}
						ref={this.EnumConfiguration}
						initial= {{
							Size: this.state.monster.Size,
							Type: this.state.monster.Type,
							Race: this.state.monster.Race,
							Alignment: this.state.monster.Alignment,
							Environment: this.state.monster.Alignment
						}} />
					<MonsterResistances
						disabled={false}
						PayloadSchema={this.payloadSchema}
						ValidationOptions={this.validateOptions}
						ref={this.Resistances}
						initial={{
							DamageResistances: this.state.monster.DamageResistances,
							DamageImmunities: this.state.monster.DamageImmunities,
							DamageVulnerabilities: this.state.monster.DamageVulnerabilities,
							ConditionImmunities: this.state.monster.ConditionImmunities
						}} />
					<MonsterDefences
						disabled={false}
						PayloadSchema={this.payloadSchema}
						ValidationOptions={this.validateOptions}
						ref={this.Defences}
						initial={{
							ArmorClass: this.state.monster.ArmorClass,
							HitPoints: this.state.monster.HitPoints,
							HitPointDistribution: this.state.monster.HitPointDistribution
						}} />
					<MonsterSpeedBonuses
						disabled={false}
						// TODO: use validation for speeds
						//PayloadSchema={this.payloadSchema}
						//ValidationOptions={this.validateOptions}
						ref={this.SpeedBonuses}
						initial={{
							// TODO: parse the speed string into SpeedLand and SpeedSwim
						}} />
					<Tile isSize={12} >
						<Tile isSize={6} isParent >
							<MonsterStats
								disabled={false}
								PayloadSchema={this.payloadSchema}
								ValidationOptions={this.validateOptions}
								ref={this.AbilityScores}
								Parent={'AbilityScores'}
								initial={{
									...this.state.monster.AbilityScores
								}} />
						</Tile>
						<Tile isSize={6} isParent >
							<MonsterStats
								disabled={false}
								PayloadSchema={this.payloadSchema}
								ValidationOptions={this.validateOptions}
								ref={this.SavingThrows}
								Parent={'SavingThrows'}
								initial={{
									...this.state.monster.SavingThrows
								}} />
						</Tile>
					</Tile>
					<MonsterSkillBonuses
						disabled={false}
						PayloadSchema={this.payloadSchema}
						ValidationOptions={this.validateOptions}
						ref={this.SkillBonuses}
						initial={{
							...this.state.monster.Skills
						}} />
					<MonsterSenseBonuses
						disabled={false}
						PayloadSchema={this.payloadSchema}
						ValidationOptions={this.validateOptions}
						ref={this.SenseBonuses}
						initial={{
							...this.state.monster.Senses
						}} />
					<Tile className="box" isVertical>
						<Subtitle>Final Touches</Subtitle>
						<Field isHorizontal>
							<FieldLabel isNormal>
								<Label>Languages</Label>
							</FieldLabel>
							<FieldBody>
								<Field>
									<Control>
										<Input
											id='Languages'
											type='text'
											placeholder='Languages'
											autoComplete='Languages'
											value={this.state.monster.Languages || ''}
											name='Languages'
											onChange={this.handleBaseMonsterChange} />
									</Control>
									<Help isColor='danger'>{this.state.monsterErrors.Languages}</Help>
								</Field>
							</FieldBody>
						</Field>
						<Field isHorizontal>
							<FieldLabel isNormal>
								<Label>Challenge Rating</Label>
							</FieldLabel>
							<FieldBody>
								<Field>
									<Control>
										<Input
											id='ChallengeRating'
											type='number'
											placeholder='Challenge Rating'
											autoComplete='ChallengeRating'
											value={this.state.monster.ChallengeRating != undefined ? this.state.monster.ChallengeRating : ''}
											name='ChallengeRating'
											onChange={this.handleMonsterFloatChange} />
									</Control>
									<Help isColor='danger'>{this.state.monsterErrors.ChallengeRating}</Help>
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
											id='ExperiencePoints'
											type='number'
											placeholder='Experience Points'
											autoComplete='ExperiencePoints'
											value={this.state.ExperiencePoints != undefined ? this.state.ExperiencePoints : ''}
											onChange={this.handleMonsterExperiencePointsChange} />
									</Control>
								</Field>
							</FieldBody>
						</Field>
					</Tile>
					<Field>
						<Button isColor='primary' type="submit" isLoading={false}>Create Monster</Button>
					</Field>
					</Tile>
				</form>
				<Modal id='monsterCreationModal' isActive={this.state.modal.open}>
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
