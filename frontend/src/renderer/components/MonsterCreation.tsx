import * as React from 'react';
import request from 'request';

import { API_URL } from '../../config';
// LEAVE THIS AS REQUIRE OR suffur from "TypeError: joi_1.default.string is not a function"
const Joi = require('joi');
import { ValidationError, ValidationErrorItem, ValidationOptions, Reference } from 'joi';

import 'bulma/css/bulma.css';

import {Redirect} from "react-router-dom"
import { Modal, ModalContent, Box, ModalBackground, Button, Tile, Field, Control, Input, Title, Subtitle, FieldLabel, Label, FieldBody, Column, Columns, Help } from 'bloomer';
import { MonsterType, MonsterRace, Size, Environment, Alignment, IMonsterState, IMonsterErrorState } from '../../monster';
import { CookieManager } from '../../cookie';
import { Select } from 'bloomer/lib/elements/Form/Select';

const types = Object.values(MonsterType);
const sizes = Object.keys(Size);
const races = Object.keys(MonsterRace);
const environments = Object.keys(Environment);
const alignments = Object.keys(Alignment);

export interface IMonsterDropdownProps {
	name: string,
	options: string[]
	onChange: (selectOption: string) => void
}

export interface IMonsterDropdownState {
	selected: string
}

export class MonsterDropdown extends React.Component<IMonsterDropdownProps, IMonsterDropdownState> {
	constructor(props: IMonsterDropdownProps) {
		super(props);
		this.state = {
			selected: props.options[0]
		};
	}

	handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		this.setState({selected: event.target.value});
		this.props.onChange(event.target.value);
	}

	render() {
		return (
			<Select id={this.props.name} onChange={this.handleChange} value={this.state.selected} className="is-fullwidth">
				{this.props.options.map(option =>
					<option
						key={this.props.name+'.'+option}
						id={this.props.name+'.'+option}
						value={option}>
						{option.replace(/([A-Z])/g, ' $1').trim()}
					</option>)}
			</Select>
		);
	}
}

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
	private abilityScoreNames = [ "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma" ];
	private savingThrowNames = [ "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma" ];
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
		HitPointDistribution: Joi.string().max(20).regex(/^((\d+d\d+)[\+\-\*\/])*(\d+d\d+)([\+\-\*\/]\d+)?$/, '#d# OR (#d# operator (#d# or number)) NO spaces'),
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

	handleMonsterTypeChange = (newType: string) => {
		const { monster, monsterErrors } = this.state
		Joi.validate(
			newType,
			Joi.reach(this.payloadSchema, ['Type']),
			this.validateOptions,
			(errors: ValidationError, value: any) => {
				this.setState({
					monster: { ...monster, Type: newType },
					monsterErrors: { ...monsterErrors, Type: errors ? errors.details[0].message : undefined}
				});
			});
	}

	handleMonsterSizeChange = (newSize: string) => {
		const { monster, monsterErrors } = this.state
		Joi.validate(
			newSize,
			Joi.reach(this.payloadSchema, ['Size']),
			this.validateOptions,
			(errors: ValidationError, value: any) => {
				this.setState({
					monster: { ...monster, Size: newSize },
					monsterErrors: { ...monsterErrors, Size: errors ? errors.details[0].message : undefined}
				});
			});
	}

	handleMonsterRaceChange = (newRace: string) => {
		const { monster, monsterErrors } = this.state
		Joi.validate(
			newRace,
			Joi.reach(this.payloadSchema, ['Race']),
			this.validateOptions,
			(errors: ValidationError, value: any) => {
				this.setState({
					monster: { ...monster, Race: newRace },
					monsterErrors: { ...monsterErrors, Race: errors ? errors.details[0].message : undefined}
				});
			});
	}

	handleMonsterEnvironmentChange = (newEnvironment: string) => {
		const { monster, monsterErrors } = this.state
		Joi.validate(
			newEnvironment,
			Joi.reach(this.payloadSchema, ['Environment']),
			this.validateOptions,
			(errors: ValidationError, value: any) => {
				this.setState({
					monster: { ...monster, Environment: newEnvironment },
					monsterErrors: { ...monsterErrors, Environment: errors ? errors.details[0].message : undefined}
				});
			});
	}

	handleMonsterAlignmentChange = (newAlignment: string) => {
		const { monster, monsterErrors } = this.state
		Joi.validate(
			newAlignment,
			Joi.reach(this.payloadSchema, ['Alignment']),
			this.validateOptions,
			(errors: ValidationError, value: any) => {
				this.setState({
					monster: { ...monster, Alignment: newAlignment },
					monsterErrors: { ...monsterErrors, Alignment: errors ? errors.details[0].message : undefined}
				});
			});
	}

	handleMonsterNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { monster, monsterErrors } = this.state
		const value = this.stringToNumber(event.target.value);
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

	handleMonsterLandSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			SpeedLand: this.stringToNumber(event.target.value)
		})
	}

	handleMonsterSwimSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			SpeedSwim: this.stringToNumber(event.target.value)
		})
	}

	handleMonsterAbilityScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { monster, monsterErrors } = this.state
		const value = this.stringToNumber(event.target.value);
		Joi.validate(
			value,
			Joi.reach(this.payloadSchema, ['AbilityScores', event.currentTarget.name]),
			this.validateOptions,
			(errors: ValidationError) => {
				this.setState({
					monster: {
						...monster,
						AbilityScores: {
							...monster.AbilityScores,
							[event.currentTarget.name]: value
						}
					},
					monsterErrors: {
						...monsterErrors,
						AbilityScores: {
							...monsterErrors.AbilityScores,
							[event.currentTarget.name]: errors ? errors.details[0].message : undefined
						}
					}
				});
			});
		}

	handleMonsterSavingThrowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { monster, monsterErrors } = this.state
		const value = this.stringToNumber(event.target.value);
		Joi.validate(
			value,
			Joi.reach(this.payloadSchema, ['SavingThrows', event.currentTarget.name]),
			this.validateOptions,
			(errors: ValidationError) => {
				this.setState({
					monster: {
						...monster,
						SavingThrows: {
							...monster.SavingThrows,
							[event.currentTarget.name]: value
						}
					},
					monsterErrors: {
						...monsterErrors,
						SavingThrows: {
							...monsterErrors.SavingThrows,
							[event.currentTarget.name]: errors ? errors.details[0].message : undefined
						}
					}
				});
			});
		}

	handleMonsterSkillChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { monster, monsterErrors } = this.state
		const value = this.stringToNumber(event.target.value);
		Joi.validate(
			{ [event.currentTarget.name]: value },
			Joi.reach(this.payloadSchema, ['Skills']),
			this.validateOptions,
			(errors: ValidationError) => {
				this.setState({
					monster: {
						...monster,
						Skills: {
							...monster.Skills,
							[event.currentTarget.name]: value
						}
					},
					monsterErrors: {
						...monsterErrors,
						Skills: {
							...monsterErrors.Skills,
							[event.currentTarget.name]: errors ? errors.details[0].message : undefined
						}
					}
				});
			});
		};

	handleMonsterSenseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { monster, monsterErrors } = this.state
		const value = this.stringToNumber(event.target.value);
		Joi.validate(
			{ [event.currentTarget.name]: value },
			Joi.reach(this.payloadSchema, ['Senses']),
			this.validateOptions,
			(errors: ValidationError) => {
				this.setState({
					monster: {
						...monster,
						Senses: {
							...monster.Senses,
							[event.currentTarget.name]: value
						}
					},
					monsterErrors: {
						...monsterErrors,
						Senses: {
							...monsterErrors.Senses,
							[event.currentTarget.name]: errors ? errors.details[0].message : undefined
						}
					}
				});
			});
		};

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

	private validateForm = (event: React.FormEvent) => {
		event.preventDefault();

			// need to convert speed to single string
			let monsterSpeed: string|undefined = this.state.SpeedLand ? this.state.SpeedLand + "ft." : ""
			monsterSpeed = this.state.SpeedSwim ? monsterSpeed + " Swimming Speed: " + this.state.SpeedSwim + " ft." : monsterSpeed
			if(monsterSpeed.length == 0)
				monsterSpeed = undefined;
			const monsterPayload: IMonsterState = {
				...this.state.monster,
				Speed: monsterSpeed,
			}

			let errors = Joi.validate(
				monsterPayload,
				this.payloadSchema,
				this.validateOptions,
				(errors: ValidationError, validationValue: any) => {
					if(errors){
						const messages: Set<string> = new Set<string>();
						errors.details.forEach((error: ValidationErrorItem) => {
							let message: string = ''
							if ((error.type == 'any.allowOnly') && error.context && this.validateOptions) {
								for (let valid of error.context.valids){
									if (Joi.isRef(valid)){
										const reference = valid as Reference
										message += reference(null, this.validateOptions) + ',';
									} else {
										message += valid + ','
									}
								}
							}
							message = error.message.split('[')[0] + message.substr(0,message.length-1);
							messages.add(message);
						})
						return Array.from(messages.values());
					}else{
						var options = { method: 'POST',
							url: API_URL + '/monster/create',
							headers:
							{
								'Cache-Control': 'no-cache',
								'Content-Type': 'application/json' ,
								'Authorization': CookieManager.UserToken('session_token')
							},
							body: validationValue,
							json: true
						};

						request(options, (error:string, responce: any, body: IMonsterCreationResponse) => {
							if (!error && body.status === 201) { // success
								this.openModal("Monster successfully created.");
								this.setState(
									{
										submitted: true
									}
								);
							} else {
								this.closeModal();
								if (body && body.messages){
									// TODO: change backend so it sends better error messages.
									// TODO: parse the error messages so they show better.
									// TODO: maybe the messages from the server shouldn't be
									// a list of strings but a JSON object so things are
									// grouped together. Easier to parse?
									this.openModal(body.messages.toString());
								}else{
									this.openModal("There was an error submitting your request. Please try again later.")
								}
							}
						})
						return undefined;
					}
				}
			);
			if(errors)
				// These errors are from validation and may be irrelevent or out of date.
				this.openModal(errors.toString());
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
					<Tile className="box" isVertical>
						<Subtitle>Basic Configurations</Subtitle>
						<Field isGrouped='centered' isHorizontal>
							<Control isExpanded>
								<Label>Type</Label>
								<MonsterDropdown name='Type' options={types} onChange={this.handleMonsterTypeChange} />
								<Help isColor='danger'>{this.state.monsterErrors.Type}</Help>
							</Control>
							<Control isExpanded>
								<Label>Size</Label>
								<MonsterDropdown name='Size' options={sizes} onChange={this.handleMonsterSizeChange} />
								<Help isColor='danger'>{this.state.monsterErrors.Size}</Help>
							</Control>
							<Control isExpanded>
								<Label>Race</Label>
								<MonsterDropdown name='Race' options={races} onChange={this.handleMonsterRaceChange} />
								<Help isColor='danger'>{this.state.monsterErrors.Race}</Help>
							</Control>
						</Field>
						<Field isGrouped='centered' isHorizontal>
							<Control isExpanded>
								<Label>Alignment</Label>
								<MonsterDropdown name='Alignment' options={alignments} onChange={this.handleMonsterAlignmentChange} />
								<Help isColor='danger'>{this.state.monsterErrors.Alignment}</Help>
							</Control>
							<Control isExpanded>
								<Label>Environment</Label>
								<MonsterDropdown name='Environment' options={environments} onChange={this.handleMonsterEnvironmentChange} />
								<Help isColor='danger'>{this.state.monsterErrors.Environment}</Help>
							</Control>
						</Field>
					</Tile>
					<Tile className="box" isVertical>
						<Subtitle>Vulnerability, Resistance, and Immunity</Subtitle>
						<Field isHorizontal>
							<FieldLabel isNormal>
								<Label>Damage Vulnerabilities </Label>
							</FieldLabel>
							<FieldBody>
								<Field>
									<Control>
										<Input
											id='DamageVulnerabilities'
											type='text'
											placeholder='Damage Vulnerabilities'
											autoComplete='DamageVulnerabilities'
											value={this.state.monster.DamageVulnerabilities || ''}
											name='DamageVulnerabilities'
											onChange={this.handleBaseMonsterChange} />
									</Control>
									<Help isColor='danger'>{this.state.monsterErrors.DamageVulnerabilities}</Help>
								</Field>
							</FieldBody>
						</Field>
						<Field isHorizontal>
							<FieldLabel isNormal>
								<Label>Damage Resistances </Label>
							</FieldLabel>
							<FieldBody>
								<Field>
									<Control>
										<Input
											id='DamageResistances'
											type='text'
											placeholder='Damage Resistances'
											autoComplete='DamageResistances'
											value={this.state.monster.DamageResistances || ''}
											name='DamageResistances'
											onChange={this.handleBaseMonsterChange} />
									</Control>
									<Help isColor='danger'>{this.state.monsterErrors.DamageResistances}</Help>
								</Field>
							</FieldBody>
						</Field>
						<Field isHorizontal>
							<FieldLabel isNormal>
								<Label>Damage Immunities </Label>
							</FieldLabel>
							<FieldBody>
								<Field>
									<Control>
										<Input
											id='DamageImmunities'
											type='text'
											placeholder='Damage Immunities'
											autoComplete='DamageImmunities'
											value={this.state.monster.DamageImmunities || ''}
											name='DamageImmunities'
											onChange={this.handleBaseMonsterChange} />
									</Control>
									<Help isColor='danger'>{this.state.monsterErrors.DamageImmunities}</Help>
								</Field>
							</FieldBody>
						</Field>
						<Field isHorizontal>
							<FieldLabel isNormal>
								<Label>Condition Immunities </Label>
							</FieldLabel>
							<FieldBody>
								<Field>
									<Control>
										<Input
											id='ConditionImmunities'
											type='text'
											placeholder='Condition Immunities'
											autoComplete='ConditionImmunities'
											value={this.state.monster.ConditionImmunities || ''}
											name='ConditionImmunities'
											onChange={this.handleBaseMonsterChange} />
									</Control>
									<Help isColor='danger'>{this.state.monsterErrors.ConditionImmunities}</Help>
								</Field>
							</FieldBody>
						</Field>
					</Tile>
					<Tile className="box" isVertical>
						<Subtitle>Armor Class and Hit Points</Subtitle>
						<Field>
							<Control>
								<Label>Armor Class</Label>
								<Input
									id='ArmorClass'
									type='number'
									placeholder='Armor Class'
									autoComplete='ArmorClass'
									value={this.state.monster.ArmorClass != undefined ? this.state.monster.ArmorClass : ''}
									name='ArmorClass'
									onChange={this.handleMonsterNumberChange} />
								<Help isColor='danger'>{this.state.monsterErrors.ArmorClass}</Help>
							</Control>
						</Field>
						<Field isGrouped='centered' isHorizontal>
							<Control isExpanded>
								<Label>Hit Points</Label>
								<Input
									id='HitPoints'
									type='number'
									placeholder='Hit Points'
									autoComplete='HitPoints'
									value={this.state.monster.HitPoints != undefined ? this.state.monster.HitPoints : ''}
									name='HitPoints'
									onChange={this.handleMonsterNumberChange} />
								<Help isColor='danger'>{this.state.monsterErrors.HitPoints}</Help>
							</Control>
							<Control isExpanded>
								<Label>Hit Point Distribution</Label>
								<Input
									id='HitPointDistribution'
									type='string'
									placeholder='Hit Points Distribution'
									autoComplete='HitPointDistribution'
									value={this.state.monster.HitPointDistribution || ''}
									name='HitPointDistribution'
									onChange={this.handleBaseMonsterChange} />
								<Help isColor='danger'>{this.state.monsterErrors.HitPointDistribution}</Help>
							</Control>
						</Field>
					</Tile>
					<Tile className="box" isVertical>
						<Subtitle>Movement Speed</Subtitle>
						<Field isGrouped='centered' isHorizontal>
							<Control isExpanded>
								<Label>Land Speed</Label>
								<Input
									id='SpeedLand'
									type='number'
									placeholder='Land Speed'
									autoComplete='SpeedLand'
									value={this.state.SpeedLand != undefined ? this.state.SpeedLand : ''}
									onChange={this.handleMonsterLandSpeedChange} />
							</Control>
							<Control isExpanded>
								<Label>Swimming Speed</Label>
								<Input
									id='SpeedSwim'
									type='number'
									placeholder='Swimming Speed'
									autoComplete='SpeedSwim'
									value={this.state.SpeedSwim != undefined ? this.state.SpeedSwim : ''}
									onChange={this.handleMonsterSwimSpeedChange} />
							</Control>
						</Field>
					</Tile>
					<Tile isSize={12} >
						<Tile isSize={6} isParent >
						<Tile className="box" isVertical isParent >
							<Tile isChild render={ (props: any) =>
								<React.Fragment>
									<Subtitle>Ability Scores</Subtitle>
									{this.abilityScoreNames.map((value: string) =>
										<Field isHorizontal key={'Ability'+value}>
											<FieldLabel isNormal>
												<Label>{value}</Label>
											</FieldLabel>
											<FieldBody>
												<Field>
													<Control>
														<Input
															id={'Ability'+value}
															type='number'
															placeholder={value}
															autoComplete={value}
															value={this.state.monster.AbilityScores[value] != undefined ? this.state.monster.AbilityScores[value] : ''}
															name={value}
															onChange={this.handleMonsterAbilityScoreChange} />
													</Control>
													<Help isColor='danger'>{this.state.monsterErrors.AbilityScores[value]}</Help>
												</Field>
											</FieldBody>
										</Field>
									)}
								</React.Fragment>
							} />
						</Tile>
						</Tile>
						<Tile isSize={6} isParent >
						<Tile className="box" isVertical isParent >
							<Tile isChild render={ (props: any) =>
								<React.Fragment>
									<Subtitle>Saving Throws</Subtitle>
									{this.savingThrowNames.map((value: string) =>
										<Field isHorizontal key={'Saving'+value}>
											<FieldLabel isNormal>
												<Label>{value}</Label>
											</FieldLabel>
											<FieldBody>
												<Field>
													<Control>
														<Input
															id={'Saving'+value}
															type='number'
															placeholder={value}
															autoComplete={value}
															value={this.state.monster.SavingThrows[value] != undefined ? this.state.monster.SavingThrows[value] : ''}
															name={value}
															onChange={this.handleMonsterSavingThrowChange} />
													</Control>
													<Help isColor='danger'>{this.state.monsterErrors.SavingThrows[value]}</Help>
												</Field>
											</FieldBody>
										</Field>
									)}
								</React.Fragment>
							} />
						</Tile>
						</Tile>
					</Tile>
					<Tile className="box" isVertical>
						<Subtitle>Skill Bonuses</Subtitle>
						<Columns isCentered>
						<Column className="box" isSize={4}>
							<Tile isChild render={ (props: any) =>
								<React.Fragment>
									{this.skillNames.slice(0,Math.round(this.skillNames.length*(1/3))).map(skillName =>
										<Field isHorizontal key={skillName}>
											<FieldLabel isNormal>
												<Label>{skillName}</Label>
											</FieldLabel>
											<FieldBody>
												<Field>
													<Control>
														<Input
															id={skillName}
															type='number'
															placeholder={skillName}
															autoComplete={skillName}
															value={this.state.monster.Skills[skillName] != undefined ? this.state.monster.Skills[skillName] : ''}
															name={skillName}
															onChange={this.handleMonsterSkillChange} />
													</Control>
													<Help isColor='danger'>{this.state.monsterErrors.Skills[skillName]}</Help>
												</Field>
											</FieldBody>
										</Field>
									)}
								</React.Fragment>
								} />
						</Column>
						<Column className='box' isSize={4}>
							<Tile isChild render={ (props: any) =>
								<React.Fragment>
									{this.skillNames.slice(Math.round(this.skillNames.length*(1/3)),Math.round(this.skillNames.length*(2/3))).map(skillName =>
										<Field isHorizontal key={skillName}>
											<FieldLabel isNormal>
												<Label>{skillName}</Label>
											</FieldLabel>
											<FieldBody>
												<Field>
													<Control>
														<Input
															id={skillName}
															type='number'
															placeholder={skillName}
															autoComplete={skillName}
															value={this.state.monster.Skills[skillName] != undefined ? this.state.monster.Skills[skillName] : ''}
															name={skillName}
															onChange={this.handleMonsterSkillChange} />
													</Control>
													<Help isColor='danger'>{this.state.monsterErrors.Skills[skillName]}</Help>
												</Field>
											</FieldBody>
										</Field>
									)}
								</React.Fragment>
								} />
						</Column>
						<Column className="box" isSize={4}>
							<Tile isChild render={ (props: any) =>
								<React.Fragment>
									{this.skillNames.slice(Math.round(this.skillNames.length*(2/3))).map(skillName =>
										<Field isHorizontal key={skillName}>
											<FieldLabel isNormal>
												<Label>{skillName}</Label>
											</FieldLabel>
											<FieldBody>
												<Field>
													<Control>
														<Input
															id={skillName}
															type='number'
															placeholder={skillName}
															autoComplete={skillName}
															value={this.state.monster.Skills[skillName] != undefined ? this.state.monster.Skills[skillName] : ''}
															name={skillName}
															onChange={this.handleMonsterSkillChange} />
													</Control>
													<Help isColor='danger'>{this.state.monsterErrors.Skills[skillName]}</Help>
												</Field>
											</FieldBody>
										</Field>
									)}
								</React.Fragment>
								} />
						</Column>
						<div/>
						</Columns>
					</Tile>
					<Tile className="box" isVertical>
						<Subtitle>Sense Bonuses</Subtitle>
						<Columns isCentered>
						<Column className="box" isSize={4}>
							<Tile isChild render={ (props: any) =>
								<React.Fragment>
									{this.senseNames.slice(0,Math.round(this.senseNames.length*(1/3))).map(senseName =>
										<Field isHorizontal key={senseName}>
											<FieldLabel isNormal>
												<Label>{senseName}</Label>
											</FieldLabel>
											<FieldBody>
												<Field>
													<Control>
														<Input
															id={senseName}
															type='number'
															placeholder={senseName}
															autoComplete={senseName}
															value={this.state.monster.Senses[senseName] != undefined ? this.state.monster.Senses[senseName] : ''}
															name={senseName}
															onChange={this.handleMonsterSenseChange} />
													</Control>
													<Help isColor='danger'>{this.state.monsterErrors.Senses[senseName]}</Help>
												</Field>
											</FieldBody>
										</Field>
									)}
								</React.Fragment>
								} />
						</Column>
						<Column className='box' isSize={4}>
							<Tile isChild render={ (props: any) =>
								<React.Fragment>
									{this.senseNames.slice(Math.round(this.senseNames.length*(1/3)),Math.round(this.senseNames.length*(2/3))).map(senseName =>
										<Field isHorizontal key={senseName}>
											<FieldLabel isNormal>
												<Label>{senseName}</Label>
											</FieldLabel>
											<FieldBody>
												<Field>
													<Control>
														<Input
															id={senseName}
															type='number'
															placeholder={senseName}
															autoComplete={senseName}
															value={this.state.monster.Senses[senseName] != undefined ? this.state.monster.Senses[senseName] : ''}
															name={senseName}
															onChange={this.handleMonsterSenseChange} />
													</Control>
													<Help isColor='danger'>{this.state.monsterErrors.Senses[senseName]}</Help>
												</Field>
											</FieldBody>
										</Field>
									)}
								</React.Fragment>
								} />
						</Column>
						<Column className="box" isSize={4}>
							<Tile isChild render={ (props: any) =>
								<React.Fragment>
									{this.senseNames.slice(Math.round(this.senseNames.length*(2/3))).map(senseName =>
										<Field isHorizontal key={senseName}>
											<FieldLabel isNormal>
												<Label>{senseName}</Label>
											</FieldLabel>
											<FieldBody>
												<Field>
													<Control>
														<Input
															id={senseName}
															type='number'
															placeholder={senseName}
															autoComplete={senseName}
															value={this.state.monster.Senses[senseName] != undefined ? this.state.monster.Senses[senseName] : ''}
															name={senseName}
															onChange={this.handleMonsterSenseChange} />
													</Control>
													<Help isColor='danger'>{this.state.monsterErrors.Senses[senseName]}</Help>
												</Field>
											</FieldBody>
										</Field>
									)}
								</React.Fragment>
								} />
						</Column>
						<div/>
						</Columns>
					</Tile>
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
