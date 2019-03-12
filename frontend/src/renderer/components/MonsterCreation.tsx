import * as React from 'react';
var request = require("request");

import { API_URL } from '../../config';
import Joi from 'joi';

import "../css/create_monster.css"
import {Redirect} from "react-router-dom"
import { Modal, ModalContent, Box, ModalBackground, Label, Dropdown, Button, DropdownTrigger, DropdownMenu, DropdownItem, DropdownContent, Tile, Field, Control, Input, Title, Subtitle, Help } from 'bloomer';
import { MonsterType, MonsterRace, Size, Environment, Alignment, IMonsterState, IMonsterSkillState, IMonsterSenseState } from '../../monster';

const types = Object.values(MonsterType);
const sizes = Object.keys(Size);
const races = Object.keys(MonsterRace);
const environments = Object.keys(Environment);
const alignments = Object.keys(Alignment);

interface IMonsterDropdownProps {
	name: string,
	options: string[]
	onChange: (selectOption: string) => void
}

interface IMonsterDropdownState {
	selected: string
}

class MonsterDropdown extends React.Component<IMonsterDropdownProps, IMonsterDropdownState> {
	constructor(props: IMonsterDropdownProps) {
		super(props);
		this.state = {
			selected: props.options[0]
		};
	}

	handleChange = (event: React.MouseEvent<HTMLInputElement>) => {
		this.setState({selected: event.currentTarget.value});
		this.props.onChange(event.currentTarget.value);
	}

	render() {
		return (
			<React.Fragment>
				<Label>{this.props.name}</Label>
				<Dropdown>
					<DropdownTrigger>
						<Button isOutlined aria-haspopup="true" aria-controls="dropdown-menu">
							<span>{this.state.selected}</span>
						</Button>
					</DropdownTrigger>
					<DropdownMenu>
						<DropdownContent>
							{this.props.options.map(option =>
							<DropdownItem
								value={option}
								onClick={this.handleChange}
								isActive={option == this.state.selected}>
								{option}
							</DropdownItem>)}
						</DropdownContent>
					</DropdownMenu>
				</Dropdown>
			</React.Fragment>
		);
	}
}

export interface IMonsterCreationProps {
	defaultMonster: IMonsterState
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
	constructor(props: IMonsterCreationProps) {
		super(props);
		this.state = {
			submitted: false,
			modal: {
				open: false,
				message: ""
			},
			monster: props.defaultMonster
		};
		this.Skills = new Map();
		this.Senses = new Map();
		const skillNames = [
			"Acrobatics", "AnimalHandling", "Arcana", "Athletics", "Deception",
			"History", "Insight", "Intimidation", "Investigation", "Medicine",
			"Nature", "Perception", "Performance", "Persuasion", "Religion",
			"SleightOfHand", "Stealth", "Survival" ];
		for(let skillName of skillNames)
			this.SkillChange.set(skillName, this.handleMonsterSkillChange(skillName));
		const senseNames = [
			"Blindsight", "Darkvision", "Tremorsense", "Truesight",
			"PassivePerception", "PassiveInvestigation", "PassiveInsight" ];
		for(let senseName of senseNames)
			this.SensesChange.set(senseName, this.handleMonsterSenseChange(senseName));
		const abilityScoreNames = [ "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma" ];
		for(let abilityScoreName of abilityScoreNames)
			this.AbilityScoreChange.set(abilityScoreName, this.handleMonsterAbilityScoreChange(abilityScoreName));
		const savingThrowNames = [ "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma" ];
		for(let savingThrowName of savingThrowNames)
			this.AbilityScoreChange.set(savingThrowName, this.handleMonsterAbilityScoreChange(savingThrowName));
	}

	Skills: Map<string, IMonsterSkillState>;
	Senses: Map<string, IMonsterSenseState>;

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
			monster: { ...monster, DamageImmunity: event.target.value }
		})
	}

	handleMonsterConditionImmunityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, ConditionImmunity: event.target.value }
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
			this.Skills.set(name, { Name: name, Bonus: this.stringToNumber(event.target.value) });
			this.setState({
				monster: {
					...this.state.monster,
					Skills: Array.from(this.Skills.values())
				}
			})
		};

	SensesChange: Map<string, ((event: React.ChangeEvent<HTMLInputElement>) => void)> = new Map();
	handleMonsterSenseChange = (name: string) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			this.Senses.set(name, { Name: name, Bonus: this.stringToNumber(event.target.value) });
			this.setState({
				monster: {
					...this.state.monster,
					Senses: Array.from(this.Senses.values())
				}
			})
		};

	handleMonsterLanguagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, languages: event.target.value }
		})
	}

	handleMonsterChallengeRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, challengeRating: this.stringToFloat(event.target.value) }
		})
	}

	handleMonsterExperiencePointsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, experiencePoints: this.stringToNumber(event.target.value) }
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

	render() {
		let experiencePointsError = this.state.monster.experiencePoints < 0
		let landSpeedError = this.state.monster.speedLand < 0
		let swimmingSpeedError = !((this.state.monster.speedSwim != null) && this.state.monster.speedSwim >= 0)

		const validateForm = (event: React.FormEvent) => {

			event.preventDefault();

			if (baseHitPointsError || hitPointDiceError || armorClassError || strStatError
				|| dexStatError || conStatError || intStatError || wisStatError || chaStatError
				|| challengeRatingError || experiencePointsError || landSpeedError || swimmingSpeedError) {
					event.preventDefault();
			}
			else {
				// Must remove spaces because of postgres issue
				let monsterType = Monster.MonsterTypeNames.get(this.state.monster.type)
				let monsterTypeString = monsterType != null ? monsterType.split(" ").join("") : ""
				let monsterAlignment = Monster.MonsterAlignmentNames.get(this.state.monster.alignment)
				let monsterAlignmentString = monsterAlignment != null ? monsterAlignment.split(" ").join("") : ""
				let hitPointDiceModifier = this.state.monster.hitPointDiceAdd != null ? this.state.monster.hitPointDiceAdd : 0
				let monsterHitPointDistribution = hitPointDiceModifier < 0 ? this.state.monster.hitPointDice + "" + hitPointDiceModifier : this.state.monster.hitPointDice + "+" + hitPointDiceModifier
				let monsterSpeed = this.state.monster.speedLand + "ft."
				monsterSpeed = this.state.monster.speedSwim != null ? monsterSpeed + " Swimming Speed: " + this.state.monster.speedSwim + " ft." : monsterSpeed
				let monsterSenses = ""
				monsterSenses = this.state.monster.sensesBlindsight != null ? monsterSenses + "Blindsight: " + this.state.monster.sensesBlindsight + " ft. " : monsterSenses
				monsterSenses = this.state.monster.sensesDarkvision != null ? monsterSenses + "Darkvision: " + this.state.monster.sensesDarkvision + " ft. " : monsterSenses
				monsterSenses = this.state.monster.sensesTremorsense != null ? monsterSenses + "Tremorsense: " + this.state.monster.sensesTremorsense + " ft. " : monsterSenses
				monsterSenses = this.state.monster.sensesTruesight != null ? monsterSenses + "Truesight: " + this.state.monster.sensesTruesight + " ft. " : monsterSenses
				monsterSenses = this.state.monster.sensesPassiveInsight != null ? monsterSenses + "Passive Insight: " + this.state.monster.sensesPassiveInsight + ". " : monsterSenses
				monsterSenses = this.state.monster.sensesPassiveInvestigation != null ? monsterSenses + "Passive Investigation: " + this.state.monster.sensesPassiveInvestigation + ". " : monsterSenses
				monsterSenses = this.state.monster.sensesPassivePerception ? monsterSenses + "Passive Perception: " + this.state.monster.sensesPassivePerception + ". " : monsterSenses
				monsterSenses = monsterSenses.length == 0 ? monsterSenses : monsterSenses.substring(0, monsterSenses.length - 1);
				let monsterRace = this.state.monster.race != null ? Monster.MonsterRaceNames.get(this.state.monster.race) : "";
				monsterRace = monsterRace == null ? "" : monsterRace.replace(/\s/g, '')

				let payloadToSend = {
					"Name" : this.state.monster.name,
					"Size" : Monster.MonsterSizeNames.get(this.state.monster.size),
					"Type" : monsterTypeString,
					"Race" : monsterRace,
					"Environment" : Monster.MonsterEnvironmentNames.get(this.state.monster.environment),
					"Alignment" : monsterAlignmentString,
					"ArmorClass" : this.state.monster.armorClass,
					"HitPoints" : this.state.monster.hitPoints,
					"HitPointDistribution": monsterHitPointDistribution,
					"Speed": monsterSpeed,
					"Senses": monsterSenses,
					"Languages": this.state.monster.languages,
					"DamageVulnerabilities": this.state.monster.vulnerability,
					"DamageResistances": this.state.monster.resistance,
					"DamageImmunities": this.state.monster.damageImmunity,
					"ConditionImmunities": this.state.monster.conditionImmunity,
					"ChallengeRating": this.state.monster.challengeRating,
					"ExperiencePoints": this.state.monster.experiencePoints,
					"AbilityScores": {
						"Strength": this.state.monster.strStat,
						"Dexterity": this.state.monster.dexStat,
						"Constitution": this.state.monster.conStat,
						"Intelligence": this.state.monster.intStat,
						"Wisdom": this.state.monster.wisStat,
						"Charisma": this.state.monster.chaStat
					},
					"SavingThrows": {
						"Strength": this.state.monster.strSavingThrow,
						"Dexterity": this.state.monster.dexSavingThrow,
						"Constitution": this.state.monster.conSavingThrow,
						"Intelligence": this.state.monster.intSavingThrow,
						"Wisdom": this.state.monster.wisSavingThrow,
						"Charisma": this.state.monster.chaSavingThrow
					},
					"Skills": [
						/*{
							"Name": "Acrobatics",
							"Bonus": this.state.monster.skillsAcrobatics
						}, {
							"Name": "Animal Handling",
							"Bonus": this.state.monster.skillsAnimalHandling
						}, {
							"Name": "Arcana",
							"Bonus": this.state.monster.skillsArcana
						}, {
							"Name": "Athletics",
							"Bonus": this.state.monster.skillsAthletics
						}, {
							"Name": "Deception",
							"Bonus": this.state.monster.skillsDeception
						}, {
							"Name": "History",
							"Bonus": this.state.monster.skillsHistory
						}, {
							"Name": "Insight",
							"Bonus": this.state.monster.skillsInsight
						}, {
							"Name": "Intimidation",
							"Bonus": this.state.monster.skillsIntimidation
						}, {
							"Name": "Investigation",
							"Bonus": this.state.monster.skillsInvestigation
						}, {
							"Name": "Medicine",
							"Bonus": this.state.monster.skillsMedicine
						}, {
							"Name": "Nature",
							"Bonus": this.state.monster.skillsNature
						}, {
							"Name": "Perception",
							"Bonus": this.state.monster.skillsPerception
						}, {
							"Name": "Performance",
							"Bonus": this.state.monster.skillsPerformance
						}, {
							"Name": "Persuasion",
							"Bonus": this.state.monster.skillsPersuasion
						}, {
							"Name": "Religion",
							"Bonus": this.state.monster.skillsReligion
						}, {
							"Name": "Sleight of Hand",
							"Bonus": this.state.monster.skillsSleightOfHand
						}, {
							"Name": "Stealth",
							"Bonus": this.state.monster.skillsStealth
						}, {
							"Name": "Survival",
							"Bonus": this.state.monster.skillsSurvival
						}*/
					]
				}

				var options = { method: 'POST',
					url: API_URL + '/monster/create',
					headers:
					{
						'Postman-Token': '018e4453-e95a-4e44-a86e-aa221fd77525',
						'Cache-Control': 'no-cache',
						'Content-Type': 'application/json' ,
						'Authorization': CookieManager.UserToken('session_token')
					},
					body: payloadToSend,
					json: true
					};

				//console.log(payloadToSend)

				request(options, (error:string, response:string, body: IMonsterCreationResponse) => {
					if (!error && body.status === 201) { // success
						this.closeModal();
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

			}
		}

		return (
			this.state.submitted ? <Redirect to="/"/> :
			<div className="monster-creation-container">
				<form onSubmit={validateForm}>
					<Title className="page-title">Create a Monster</Title>
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
					<Box>
						<Subtitle>Type Configurations</Subtitle>
						<Field isGrouped='centered' isHorizontal>
							<Control isExpanded>
								<MonsterDropdown name={'Type'} options={types} onChange={this.handleMonsterTypeChange} />
							</Control>
							<Control isExpanded>
								<MonsterDropdown name={'Size'} options={sizes} onChange={this.handleMonsterSizeChange} />
							</Control>
							<Control isExpanded>
								<MonsterDropdown name={'Race'} options={races} onChange={this.handleMonsterRaceChange} />
							</Control>
						</Field>
						<Field isGrouped='centered' isHorizontal>
							<Control isExpanded>
								<MonsterDropdown name={'Alignment'} options={alignments} onChange={this.handleMonsterAlignmentChange} />
							</Control>
							<Control isExpanded>
								<MonsterDropdown name={'Environment'} options={environments} onChange={this.handleMonsterEnvironmentChange} />
							</Control>
						</Field>
					</Box>
					<Box>
						<Subtitle>Vulnerability, Resistance, and Immunity</Subtitle>
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
						<Field>
							<Control>
								<Input
									id='ConditionImmunities'
									type='text'
									placeholder='Condition Immunities'
									autoComplete='ConditionImmunities'
									value={this.state.monster.ConditionImmunities}
									onChange={this.handleMonsterResistanceChange} />
							</Control>
						</Field>
					</Box>
					<Box>
						<Subtitle>Armor Class and Hit Points</Subtitle>
						<Field>
							<Control>
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
								<Input
									id='HitPoints'
									type='number'
									placeholder='Hit Points'
									autoComplete='HitPoints'
									value={this.state.monster.HitPoints}
									onChange={this.handleMonsterHitPointsChange} />
							</Control>
							<Control isExpanded>
								<Input
									id='HitPointDistribution'
									type='string'
									placeholder='Hit Points Distribution'
									autoComplete='HitPointDistribution'
									value={this.state.monster.HitPointDistribution}
									onChange={this.handleMonsterHitPointDistributionChange} />
							</Control>
							<Help>Hit Points Distribution should be of the form "#d# + base". # are numbers</Help>
						</Field>
					</Box>
					<Box>
						<Subtitle>Movement Speed</Subtitle>
						<Field isGrouped='centered' isHorizontal>
							<Control isExpanded>
								<Input
									id='SpeedLand'
									type='number'
									placeholder='Land Speed'
									autoComplete='SpeedLand'
									value={this.state.SpeedLand}
									onChange={this.handleMonsterLandSpeedChange} />
							</Control>
							<Control isExpanded>
								<Input
									id='SpeedSwim'
									type='number'
									placeholder='Swimming Speed'
									autoComplete='SpeedSwim'
									value={this.state.SpeedSwim}
									onChange={this.handleMonsterSwimSpeedChange} />
							</Control>
						</Field>
					</Box>
					<Tile isAncestor>
						<Tile isSize={6} isParent>
							<Tile isChild render={ (props: any) =>
								<Box>
									<Subtitle>Ability Scores</Subtitle>
									<Field>
										<Control>
											<Input
												id='Strength'
												type='number'
												placeholder='Strength'
												autoComplete='Strength'
												value={this.state.monster.AbilityScores.Strength}
												onChange={this.AbilityScoreChange.get('Strength')} />
										</Control>
									</Field>
									<Field>
										<Control>
											<Input
												id='Dexterity'
												type='number'
												placeholder='Dexterity'
												autoComplete='Dexterity'
												value={this.state.monster.AbilityScores.Dexterity}
												onChange={this.AbilityScoreChange.get('Dexterity')} />
										</Control>
									</Field>
									<Field>
										<Control>
											<Input
												id='Constitution'
												type='number'
												placeholder='Constitution'
												autoComplete='Constitution'
												value={this.state.monster.AbilityScores.Constitution}
												onChange={this.AbilityScoreChange.get('Constitution')} />
										</Control>
									</Field>
									<Field>
										<Control>
											<Input
												id='Intelligence'
												type='number'
												placeholder='Intelligence'
												autoComplete='Intelligence'
												value={this.state.monster.AbilityScores.Intelligence}
												onChange={this.AbilityScoreChange.get('Intelligence')} />
										</Control>
									</Field>
									<Field>
										<Control>
											<Input
												id='Wisdom'
												type='number'
												placeholder='Wisdom'
												autoComplete='Wisdom'
												value={this.state.monster.AbilityScores.Wisdom}
												onChange={this.AbilityScoreChange.get('Wisdom')} />
										</Control>
									</Field>
									<Field>
										<Control>
											<Input
												id='Charisma'
												type='number'
												placeholder='Charisma'
												autoComplete='Charisma'
												value={this.state.monster.AbilityScores.Charisma}
												onChange={this.AbilityScoreChange.get('Charisma')} />
										</Control>
									</Field>
								</Box>
							} />
						</Tile>
						<Tile isSize={6} isParent>
							<Tile isChild render={ (props: any) =>
								<Box>
									<Subtitle>Saving Throws</Subtitle>
									<Field>
										<Control>
											<Input
												id='Strength'
												type='number'
												placeholder='Strength'
												autoComplete='Strength'
												value={this.state.monster.SavingThrows.Strength}
												onChange={this.SavingThrowChange.get('Strength')} />
										</Control>
									</Field>
									<Field>
										<Control>
											<Input
												id='Dexterity'
												type='number'
												placeholder='Dexterity'
												autoComplete='Dexterity'
												value={this.state.monster.SavingThrows.Dexterity}
												onChange={this.SavingThrowChange.get('Dexterity')} />
										</Control>
									</Field>
									<Field>
										<Control>
											<Input
												id='Constitution'
												type='number'
												placeholder='Constitution'
												autoComplete='Constitution'
												value={this.state.monster.SavingThrows.Constitution}
												onChange={this.SavingThrowChange.get('Constitution')} />
										</Control>
									</Field>
									<Field>
										<Control>
											<Input
												id='Intelligence'
												type='number'
												placeholder='Intelligence'
												autoComplete='Intelligence'
												value={this.state.monster.SavingThrows.Intelligence}
												onChange={this.SavingThrowChange.get('Intelligence')} />
										</Control>
									</Field>
									<Field>
										<Control>
											<Input
												id='Wisdom'
												type='number'
												placeholder='Wisdom'
												autoComplete='Wisdom'
												value={this.state.monster.SavingThrows.Wisdom}
												onChange={this.SavingThrowChange.get('Wisdom')} />
										</Control>
									</Field>
									<Field>
										<Control>
											<Input
												id='Charisma'
												type='number'
												placeholder='Charisma'
												autoComplete='Charisma'
												value={this.state.monster.SavingThrows.Charisma}
												onChange={this.SavingThrowChange.get('Charisma')} />
										</Control>
									</Field>
								</Box>
							} />
						</Tile>
					</Tile>
					<Tile isAncestor>
						<Subtitle>Skill Bonuses</Subtitle>
						<Tile isSize={4} isParent>
							<Tile isChild render={ (props: any) =>
								<Box>
									<Field>
										<Control>
											<Input
												id='Strength'
												type='number'
												placeholder='Strength'
												autoComplete='Strength'
												value={this.state.monster.Skills[0].Bonus}
												onChange={this.SavingThrowChange.get('Strength')} />
										</Control>
									</Field>
								</Box>
								} />
						</Tile>
					</Tile>
					<Grid container spacing={24}>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="athletics" label="Athletics Modifier" value={this.state.monster.skillsAthletics} onChange={this.handleMonsterAthleticsChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="acrobatics" label="Acrobatics Modifier" value={this.state.monster.skillsAcrobatics} onChange={this.handleMonsterAcrobaticsChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="sleightOfHand" label="Sleight of Hand Modifier" value={this.state.monster.skillsSleightOfHand} onChange={this.handleMonsterSleightOfHandChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="stealth" label="Stealth Modifier" value={this.state.monster.skillsStealth} onChange={this.handleMonsterStealthChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="arcana" label="Arcana Modifier" value={this.state.monster.skillsArcana} onChange={this.handleMonsterArcanaChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="history" label="History Modifier" value={this.state.monster.skillsHistory} onChange={this.handleMonsterHistoryChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="investigation" label="Investigation Modifier" value={this.state.monster.skillsInvestigation} onChange={this.handleMonsterInvestigationChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="nature" label="Nature Modifier" value={this.state.monster.skillsNature} onChange={this.handleMonsterNatureChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="religion" label="Religion Modifier" value={this.state.monster.skillsReligion} onChange={this.handleMonsterReligionChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="animalHandling" label="Animal Handling Modifier" value={this.state.monster.skillsAnimalHandling} onChange={this.handleMonsterAnimalHandlingChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="insight" label="Insight Modifier" value={this.state.monster.skillsInsight} onChange={this.handleMonsterInsightChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="medicine" label="Medicine Modifier" value={this.state.monster.skillsMedicine} onChange={this.handleMonsterMedicineChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="perception" label="Perception Modifier" value={this.state.monster.skillsPerception} onChange={this.handleMonsterPerceptionChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="survival" label="Survival Modifier" value={this.state.monster.skillsSurvival} onChange={this.handleMonsterSurvivalChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="deception" label="Deception Modifier" value={this.state.monster.skillsDeception} onChange={this.handleMonsterDeceptionChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="intimidation" label="Intimidation Modifier" value={this.state.monster.skillsIntimidation} onChange={this.handleMonsterIntimidationChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="performance" label="Performance Modifier" value={this.state.monster.skillsPerformance} onChange={this.handleMonsterPerformanceChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="persuasion" label="Persuasion Modifier" value={this.state.monster.skillsPersuasion} onChange={this.handleMonsterPersuasionChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={3}>
							<div className="form-group">
								<TextField error = {false} id="blindsight" label="Blindsight" value={this.state.monster.sensesBlindsight} onChange={this.handleMonsterBlindsightChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={3}>
							<div className="form-group">
								<TextField error = {false} id="darkvision" label="Darkvision" value={this.state.monster.sensesDarkvision} onChange={this.handleMonsterDarkvisionChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={3}>
							<div className="form-group">
								<TextField error = {false} id="tremorsense" label="Tremorsense" value={this.state.monster.sensesTremorsense} onChange={this.handleMonsterTremorsenseChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={3}>
							<div className="form-group">
								<TextField error = {false} id="truesight" label="Truesight" value={this.state.monster.sensesTruesight} onChange={this.handleMonsterTruesightChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="passivePerception" label="Passive Perception" value={this.state.monster.sensesPassivePerception} onChange={this.handleMonsterPassivePerceptionChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="passiveInvestigation" label="Passive Investigation" value={this.state.monster.sensesPassiveInvestigation} onChange={this.handleMonsterPassiveInvestigationChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="passiveInsight" label="Passive Insight" value={this.state.monster.sensesPassiveInsight} onChange={this.handleMonsterPassiveInsightChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={12}>
							<div className="form-group">
								<TextField error={false} margin="dense" value={this.state.monster.languages} id="languages" label="Languages" helperText="" fullWidth onChange={this.handleMonsterLanguagesChange}/>
							</div>
						</Grid>
						<Grid item xs={6}>
							<div className="form-group">
								<TextField error = {challengeRatingError} helperText={challengeRatingError? "You cannot have a negative challenge rating." : ""} required id="challengeRating" label="Challenge Rating" value={this.state.monster.challengeRating} onChange={this.handleMonsterChallengeRatingChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={6}>
							<div className="form-group">
								<TextField error = {experiencePointsError} helperText={experiencePointsError? "You cannot have negative experience points." : ""} required id="experiencePoints" label="Experience Points" value={this.state.monster.experiencePoints} onChange={this.handleMonsterExperiencePointsChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
					</Grid>
					<Button className="button" variant="contained" color="primary" type="submit"> Create Monster </Button>
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
