import * as React from 'react';
import request from 'request';

import { API_URL } from '../../config';
// LEAVE THIS AS REQUIRE OR suffur from "TypeError: joi_1.default.string is not a function"
const Joi = require('joi');
import { ValidationError, ValidationErrorItem, ValidationOptions, Reference } from 'joi';

import 'bulma/css/bulma.css';

import {Redirect} from "react-router-dom"
import { Modal, ModalContent, Box, ModalBackground, Button, Tile, Field, Control, Input, Title, Subtitle, FieldLabel, Label, FieldBody, Column, Columns } from 'bloomer';
import { MonsterType, MonsterRace, Size, Environment, Alignment, IMonsterState, SenseMap } from '../../monster';
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
		"Acrobatics", "AnimalHandling", "Arcana", "Athletics", "Deception", "History", "Insight",
		"Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance",
		"Persuasion", "Religion", "SleightOfHand", "Stealth", "Survival" ];
	private senseNames = [
		"Blindsight", "Darkvision", "Tremorsense", "Truesight",
		"PassivePerception", "PassiveInvestigation", "PassiveInsight" ];
	private abilityScoreNames = [ "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma" ];
	private savingThrowNames = [ "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma" ];
	private payloadSchema = Joi.object({
		Name: Joi.string().required().max(50),
		Size: Joi.string().valid(Joi.ref('$SizeOptions')),
		Type: Joi.string().valid(Joi.ref('$TypeOptions')),
		Race: Joi.string().valid(Joi.ref('$RaceOptions')),
		Alignment: Joi.string().valid(Joi.ref('$AlignmentOptions')),
		Environment: Joi.string().valid(Joi.ref('$EnvironmentOptions')),
		ArmorClass: Joi.number().integer().greater(0),
		HitPoints: Joi.number().integer().greater(0),
		// (rolls 'd' dice [+ - * /] operation) one or more times then rolls 'd' dice
		HitPointDistribution: Joi.string().max(20).regex(/^(\ *(\d+d\d+)\ *[\+\-\*\/]\ *)*(\ *(\d+d\d+))\ *(\+\d+)?$/, 'distribution'),
		Speed: Joi.string().max(100),
		// TODO: change senses to a dictionary and send just like skills, when the backend changes.
		Senses: Joi.string().max(250),
		Languages: Joi.string().max(100),
		DamageVulnerabilities: Joi.string().allow('').max(200),
		DamageResistances: Joi.string().allow('').max(200),
		DamageImmunities: Joi.string().allow('').max(200),
		ConditionImmunities: Joi.string().allow('').max(200),
		ChallengeRating: Joi.number().greater(0),
		ExperiencePoints: Joi.number().greater(0),
		AbilityScores: Joi.object({
			Strength: Joi.number().integer().greater(0),
			Dexterity: Joi.number().integer().greater(0),
			Constitution: Joi.number().integer().greater(0),
			Intelligence: Joi.number().integer().greater(0),
			Wisdom: Joi.number().integer().greater(0),
			Charisma: Joi.number().integer().greater(0)
		}).default({}),
		SavingThrows: Joi.object({
			Strength: Joi.number().integer(),
			Dexterity: Joi.number().integer(),
			Constitution: Joi.number().integer(),
			Intelligence: Joi.number().integer(),
			Wisdom: Joi.number().integer(),
			Charisma: Joi.number().integer()
		}).default({}),
		/* This is how to send skills as a dictionary. */
		Skills: Joi.object().pattern(
			Joi.symbol().valid(this.skillNames),
			Joi.number().integer().greater(0).allow(0).label('Skill Bonus')
		).default({}),
		/* This is how to send skills as an array of objects.
		Skills: Joi.array().items(Joi.object({
			Name: Joi.string().required().valid(Joi.ref('$SkillOptions')).label('Skill Name'),
			Bonus: Joi.number().integer().greater(0).allow(0).required().label('Skill Bonus')
		})).default([]),*/
		Actions: Joi.array().items(Joi.object({
			Name: Joi.string().required().max(50),
			Description: Joi.string().required().max(250),
			HitBonus: Joi.number().integer().greater(0).allow(0),
			Damage: Joi.string().max(20).regex(/^(\ *(\d+d\d+)\ *[\+\-\*\/]\ *)*(\ *(\d+d\d+))\ *(\+\d+)?$/, 'range'),
			DamageBonus: Joi.number().integer().greater(0).allow(0),
			Type: Joi.string().valid(Joi.ref('$ActionOptions'))
		}).label('Action Items')).default([])
	});

	constructor(props: IMonsterCreationProps) {
		super(props);
		this.state = {
			submitted: false,
			modal: {
				open: false,
				message: ""
			},
			monster: props.defaultMonster == undefined ? {
				Id: '',
				Name: '',
				AbilityScores: {},
				SavingThrows: {},
				Senses: {},
				Skills: {},
			} : props.defaultMonster
		};
		if(this.state.monster.Senses instanceof String){
			let stringSenses = this.state.monster.Senses as string;
			let eachSense = stringSenses.split('.');
			this.state.monster.Senses = {}
			for (let sense of eachSense) {
				const senseName = sense.split(':')[0].trim()
				const senseValue = this.stringToNumber(sense.split(':')[1].replace(/[^0-9]/g,''));
				this.state.monster.Senses[senseName] = senseValue;
			}
		}
		for(let skillName of this.skillNames)
			this.SkillChange.set(skillName, this.handleMonsterSkillChange(skillName));
		for(let senseName of this.senseNames)
			this.SensesChange.set(senseName, this.handleMonsterSenseChange(senseName));
		for(let abilityScoreName of this.abilityScoreNames)
			this.AbilityScoreChange.set(abilityScoreName, this.handleMonsterAbilityScoreChange(abilityScoreName));
		for(let savingThrowName of this.savingThrowNames)
			this.SavingThrowChange.set(savingThrowName, this.handleMonsterSavingThrowChange(savingThrowName));
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
		return parseInt(toConvert) != NaN ? parseInt(toConvert) : 0
	}

	stringToFloat = (toConvert : string) => {
		return parseFloat(toConvert) != NaN ? parseFloat(toConvert) : 0
	}

	handleMonsterNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, Name: event.target.value }
		})
	}

	handleMonsterTypeChange = (newType: string) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, Type: newType }
		})
	}

	handleMonsterSizeChange = (newSize: string) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, Size: newSize }
		})
	}

	handleMonsterRaceChange = (newRace: string) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, Race: newRace }
		})
	}
	handleMonsterEnvironmentChange = (newEnvironment: string) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, Environment: newEnvironment }
		})
	}
	handleMonsterAlignmentChange = (newAlignment: string) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, Alignment: newAlignment }
		})
	}

	handleMonsterResistanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, DamageResistances: event.target.value }
		})
	}

	handleMonsterDamageImmunityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, DamageImmunities: event.target.value }
		})
	}

	handleMonsterConditionImmunityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, ConditionImmunities: event.target.value }
		})
	}

	handleMonsterVulnerabilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, DamageVulnerabilities: event.target.value }
		})
	}

	handleMonsterArmorClassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, ArmorClass: this.stringToNumber(event.target.value)}
		})

	}

	handleMonsterHitPointsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, HitPoints: this.stringToNumber(event.target.value)}
		})
	}

	handleMonsterHitPointDistributionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, HitPointDistribution: event.target.value }
		})
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

	AbilityScoreChange: Map<string, (event: React.ChangeEvent<HTMLInputElement>) => void> = new Map();
	handleMonsterAbilityScoreChange = (name: string) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newState = {
				monster: {
					...this.state.monster,
					AbilityScores: {
						...this.state.monster.AbilityScores
					}
				}
			};
			let value = this.stringToNumber(event.target.value);
			newState.monster.AbilityScores[name] = value;
			this.setState(newState);
		}

	SavingThrowChange: Map<string, (event: React.ChangeEvent<HTMLInputElement>) => void> = new Map();
	handleMonsterSavingThrowChange = (name: string) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newState = {
				monster: {
					...this.state.monster,
					SavingThrows: {
						...this.state.monster.SavingThrows
					}
				}
			};
			let value = this.stringToNumber(event.target.value);
			newState.monster.SavingThrows[name] = value;
			this.setState(newState);
		}

	SkillChange: Map<string, ((event: React.ChangeEvent<HTMLInputElement>) => void)> = new Map();
	handleMonsterSkillChange = (name: string) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			this.setState({
				monster: {
					...this.state.monster,
					Skills: {
						...this.state.monster.Skills,
						[name]: this.stringToNumber(event.target.value)
					}
				}
			})
		};

	SensesChange: Map<string, ((event: React.ChangeEvent<HTMLInputElement>) => void)> = new Map();
	handleMonsterSenseChange = (name: string) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			this.setState({
				monster: {
					...this.state.monster,
					Senses: {
						...(this.state.monster.Senses as SenseMap),
						[name]: this.stringToNumber(event.target.value)
					}
				}
			})
		};

	handleMonsterLanguagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, Languages: event.target.value }
		})
	}

	handleMonsterChallengeRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, ChallengeRating: this.stringToFloat(event.target.value) }
		})
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
			let monsterSpeed = this.state.SpeedLand + "ft."
			monsterSpeed = this.state.SpeedSwim != null ? monsterSpeed + " Swimming Speed: " + this.state.SpeedSwim + " ft." : monsterSpeed
			// TODO remove this when the payload accepts senses as a dictionary.
			let monsterSenses = ""
			for (let sense in this.state.monster.Senses as SenseMap) {
				let units = '';
				if (sense.startsWith('Passive')) {
					units = '.';
				} else {
					units = ' ft.';
				}
				if ((this.state.monster.Senses as SenseMap)[sense]>0)
					monsterSenses += ' ' + sense + ': ' + (this.state.monster.Senses as SenseMap)[sense]+ units;
			}
			monsterSenses = monsterSenses.trim();
			const monsterPayload: IMonsterState = {
				...this.state.monster,
				Speed: monsterSpeed,
				Senses: monsterSenses
			}

			const validateOptions: ValidationOptions = {
				abortEarly: false,
				convert: true,
				allowUnknown: false,
				context: {
					SizeOptions: Object.keys(Size),
					TypeOptions: Object.keys(MonsterType),
					RaceOptions: Object.keys(MonsterRace),
					AlignmentOptions: Object.keys(Alignment),
					EnvironmentOptions: Object.keys(Environment)
				}
			}

			let errors = Joi.validate(
				monsterPayload,
				this.payloadSchema,
				validateOptions,
				(errors: ValidationError, validationValue: any) => {
					if(errors){
						const messages: Set<string> = new Set<string>();
						errors.details.forEach((error: ValidationErrorItem) => {
							let message: string = ''
							if ((error.type == 'any.allowOnly') && error.context && validateOptions) {
								for (let valid of error.context.valids){
									if (Joi.isRef(valid)){
										const reference = valid as Reference
										message += reference(null, validateOptions) + ',';
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
								if (body.messages){
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
									value={this.state.monster.Name}
									onChange={this.handleMonsterNameChange}
									required />
							</Control>
						</Field>
					</Tile>
					<Tile className="box" isVertical>
						<Subtitle>Basic Configurations</Subtitle>
						<Field isGrouped='centered' isHorizontal>
							<Control isExpanded>
								<Label>Type</Label>
								<MonsterDropdown name='Type' options={types} onChange={this.handleMonsterTypeChange} />
							</Control>
							<Control isExpanded>
								<Label>Size</Label>
								<MonsterDropdown name='Size' options={sizes} onChange={this.handleMonsterSizeChange} />
							</Control>
							<Control isExpanded>
								<Label>Race</Label>
								<MonsterDropdown name='Race' options={races} onChange={this.handleMonsterRaceChange} />
							</Control>
						</Field>
						<Field isGrouped='centered' isHorizontal>
							<Control isExpanded>
								<Label>Alignment</Label>
								<MonsterDropdown name='Alignment' options={alignments} onChange={this.handleMonsterAlignmentChange} />
							</Control>
							<Control isExpanded>
								<Label>Environment</Label>
								<MonsterDropdown name='Environment' options={environments} onChange={this.handleMonsterEnvironmentChange} />
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
											value={this.state.monster.DamageVulnerabilities}
											onChange={this.handleMonsterVulnerabilityChange} />
									</Control>
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
											value={this.state.monster.DamageResistances}
											onChange={this.handleMonsterResistanceChange} />
									</Control>
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
											value={this.state.monster.DamageImmunities}
											onChange={this.handleMonsterDamageImmunityChange} />
									</Control>
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
											value={this.state.monster.ConditionImmunities}
											onChange={this.handleMonsterConditionImmunityChange} />
									</Control>
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
									value={this.state.monster.ArmorClass}
									onChange={this.handleMonsterArmorClassChange} />
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
									value={this.state.monster.HitPoints}
									onChange={this.handleMonsterHitPointsChange} />
							</Control>
							<Control isExpanded>
								<Label>Hit Point Distribution</Label>
								<Input
									id='HitPointDistribution'
									type='string'
									placeholder='Hit Points Distribution'
									autoComplete='HitPointDistribution'
									value={this.state.monster.HitPointDistribution}
									onChange={this.handleMonsterHitPointDistributionChange} />
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
									value={this.state.SpeedLand}
									onChange={this.handleMonsterLandSpeedChange} />
							</Control>
							<Control isExpanded>
								<Label>Swimming Speed</Label>
								<Input
									id='SpeedSwim'
									type='number'
									placeholder='Swimming Speed'
									autoComplete='SpeedSwim'
									value={this.state.SpeedSwim}
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
									<Field isHorizontal>
										<FieldLabel isNormal>
											<Label>Strength</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														id='AbilityStrength'
														type='number'
														placeholder='Strength'
														autoComplete='Strength'
														value={this.state.monster.AbilityScores.Strength}
														onChange={this.AbilityScoreChange.get('Strength')} />
												</Control>
											</Field>
										</FieldBody>
									</Field>
									<Field isHorizontal>
										<FieldLabel isNormal>
											<Label>Dexterity</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														id='AbilityDexterity'
														type='number'
														placeholder='Dexterity'
														autoComplete='Dexterity'
														value={this.state.monster.AbilityScores.Dexterity}
														onChange={this.AbilityScoreChange.get('Dexterity')} />
												</Control>
											</Field>
										</FieldBody>
									</Field>
									<Field isHorizontal>
										<FieldLabel isNormal>
											<Label>Constitution</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														id='AbilityConstitution'
														type='number'
														placeholder='Constitution'
														autoComplete='Constitution'
														value={this.state.monster.AbilityScores.Constitution}
														onChange={this.AbilityScoreChange.get('Constitution')} />
												</Control>
											</Field>
										</FieldBody>
									</Field>
									<Field isHorizontal>
										<FieldLabel isNormal>
											<Label>Intelligence</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														id='AbilityIntelligence'
														type='number'
														placeholder='Intelligence'
														autoComplete='Intelligence'
														value={this.state.monster.AbilityScores.Intelligence}
														onChange={this.AbilityScoreChange.get('Intelligence')} />
												</Control>
											</Field>
										</FieldBody>
									</Field>
									<Field isHorizontal>
										<FieldLabel isNormal>
											<Label>Wisdom</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														id='AbilityWisdom'
														type='number'
														placeholder='Wisdom'
														autoComplete='Wisdom'
														value={this.state.monster.AbilityScores.Wisdom}
														onChange={this.AbilityScoreChange.get('Wisdom')} />
												</Control>
											</Field>
										</FieldBody>
									</Field>
									<Field isHorizontal>
										<FieldLabel isNormal>
											<Label>Charisma</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														id='AbilityCharisma'
														type='number'
														placeholder='Charisma'
														autoComplete='Charisma'
														value={this.state.monster.AbilityScores.Charisma}
														onChange={this.AbilityScoreChange.get('Charisma')} />
												</Control>
											</Field>
										</FieldBody>
									</Field>
								</React.Fragment>
							} />
						</Tile>
						</Tile>
						<Tile isSize={6} isParent >
						<Tile className="box" isVertical isParent >
							<Tile isChild render={ (props: any) =>
								<React.Fragment>
									<Subtitle>Saving Throws</Subtitle>
									<Field isHorizontal>
										<FieldLabel isNormal>
											<Label>Strength</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														id='SavingStrength'
														type='number'
														placeholder='Strength'
														autoComplete='Strength'
														value={this.state.monster.SavingThrows.Strength}
														onChange={this.SavingThrowChange.get('Strength')} />
												</Control>
											</Field>
										</FieldBody>
									</Field>
									<Field isHorizontal>
										<FieldLabel isNormal>
											<Label>Dexterity</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														id='SavingDexterity'
														type='number'
														placeholder='Dexterity'
														autoComplete='Dexterity'
														value={this.state.monster.SavingThrows.Dexterity}
														onChange={this.SavingThrowChange.get('Dexterity')} />
												</Control>
											</Field>
										</FieldBody>
									</Field>
									<Field isHorizontal>
										<FieldLabel isNormal>
											<Label>Constitution</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														id='SavingConstitution'
														type='number'
														placeholder='Constitution'
														autoComplete='Constitution'
														value={this.state.monster.SavingThrows.Constitution}
														onChange={this.SavingThrowChange.get('Constitution')} />
												</Control>
											</Field>
										</FieldBody>
									</Field>
									<Field isHorizontal>
										<FieldLabel isNormal>
											<Label>Intelligence</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														id='SavingIntelligence'
														type='number'
														placeholder='Intelligence'
														autoComplete='Intelligence'
														value={this.state.monster.SavingThrows.Intelligence}
														onChange={this.SavingThrowChange.get('Intelligence')} />
												</Control>
											</Field>
										</FieldBody>
									</Field>
									<Field isHorizontal>
										<FieldLabel isNormal>
											<Label>Wisdom</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														id='SavingWisdom'
														type='number'
														placeholder='Wisdom'
														autoComplete='Wisdom'
														value={this.state.monster.SavingThrows.Wisdom}
														onChange={this.SavingThrowChange.get('Wisdom')} />
												</Control>
											</Field>
										</FieldBody>
									</Field>
									<Field isHorizontal>
										<FieldLabel isNormal>
											<Label>Charisma</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														id='SavingCharisma'
														type='number'
														placeholder='Charisma'
														autoComplete='Charisma'
														value={this.state.monster.SavingThrows.Charisma}
														onChange={this.SavingThrowChange.get('Charisma')} />
												</Control>
											</Field>
										</FieldBody>
									</Field>
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
															value={this.state.monster.Skills[skillName]}
															onChange={this.SkillChange.get(skillName)} />
													</Control>
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
															value={this.state.monster.Skills[skillName]}
															onChange={this.SkillChange.get(skillName)} />
													</Control>
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
															value={this.state.monster.Skills[skillName]}
															onChange={this.SkillChange.get(skillName)} />
													</Control>
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
															value={(this.state.monster.Senses as SenseMap)[senseName]}
															onChange={this.SensesChange.get(senseName)} />
													</Control>
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
															value={(this.state.monster.Senses as SenseMap)[senseName]}
															onChange={this.SensesChange.get(senseName)} />
													</Control>
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
															value={(this.state.monster.Senses as SenseMap)[senseName]}
															onChange={this.SensesChange.get(senseName)} />
													</Control>
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
											value={this.state.monster.Languages}
											onChange={this.handleMonsterLanguagesChange} />
									</Control>
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
											value={this.state.monster.ChallengeRating}
											onChange={this.handleMonsterChallengeRatingChange} />
									</Control>
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
											value={this.state.ExperiencePoints}
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
