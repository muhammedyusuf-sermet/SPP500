import * as React from 'react';
var request = require("request");

import { API_URL } from '../../config';
import Joi from 'joi';

import "../css/create_monster.css"
import {Redirect} from "react-router-dom"
import { Modal, ModalContent, Box, ModalBackground, Label, Dropdown, Button, DropdownTrigger, DropdownMenu, DropdownItem, DropdownContent } from 'bloomer';
import { MonsterType, MonsterRace, Size, Environment, Alignment, IMonsterState, IMonsterSkillState } from '../../monster';

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
	HitPointDistributionBase?: number;
	SpeedLand?: number,
	SpeedSwim?: number,
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
	}

	Skills: Map<string, IMonsterSkillState>;

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

	handleMonsterTypeChange = (newType: MonsterType) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, Type: newType }
		})
	}

	handleMonsterSizeChange = (newSize: Size) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, Size: newSize }
		})
	}

	handleMonsterRaceChange = (newRace: MonsterRace) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, Race: newRace }
		})
	}
	handleMonsterEnvironmentChange = (newEnvironment: Environment) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, Environment: newEnvironment }
		})
	}
	handleMonsterAlignmentChange = (newAlignment: Alignment) => {
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

	handleMonsterHitPointDiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, HitPointDistribution: event.target.value }
		})
	}

	handleMonsterHitPointDiceModifierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			HitPointDistributionBase: this.stringToNumber(event.target.value)
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

	/*handleMonsterStrStatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: {
				...monster,
				AbilityScores: {
					...monster.AbilityScores,
					Strength: this.stringToNumber(event.target.value)
				}
			}
		})
	}

	handleMonsterDexStatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: {
				...monster,
				AbilityScores: {
					...monster.AbilityScores,
					Dexterity: this.stringToNumber(event.target.value)
				}
			}
		})
	}

	handleMonsterConStatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: {
				...monster,
				AbilityScores: {
					...monster.AbilityScores,
					Constitution: this.stringToNumber(event.target.value)
				}
			}
		})
	}

	handleMonsterIntStatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: {
				...monster,
				AbilityScores: {
					...monster.AbilityScores,
					Intelligence: this.stringToNumber(event.target.value)
				}
			}
		})
	}

	handleMonsterWisStatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: {
				...monster,
				AbilityScores: {
					...monster.AbilityScores,
					Wisdom: this.stringToNumber(event.target.value)
				}
			}
		})
	}

	handleMonsterChaStatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: {
				...monster,
				AbilityScores: {
					...monster.AbilityScores,
					Charisma: this.stringToNumber(event.target.value)
				}
			}
		})
	}

	handleMonsterStrSavingThrowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: {
				...monster,
				SavingThrows: {
					...monster.SavingThrows,
					Strength: this.stringToNumber(event.target.value)
				}
			}
		})
	}

	handleMonsterDexSavingThrowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: {
				...monster,
				SavingThrows: {
					...monster.SavingThrows,
					Dexterity: this.stringToNumber(event.target.value)
				}
			}
		})
	}

	handleMonsterConSavingThrowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: {
				...monster,
				SavingThrows: {
					...monster.SavingThrows,
					Constitution: this.stringToNumber(event.target.value)
				}
			}
		})
	}

	handleMonsterIntSavingThrowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: {
				...monster,
				SavingThrows: {
					...monster.SavingThrows,
					Intelligence: this.stringToNumber(event.target.value)
				}
			}
		})
	}

	handleMonsterWisSavingThrowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: {
				...monster,
				SavingThrows: {
					...monster.SavingThrows,
					Wisdom: this.stringToNumber(event.target.value)
				}
			}
		})
	}*/

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

	handleMonsterAcrobaticsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsAcrobatics: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterSleightOfHandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsSleightOfHand: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterStealthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsStealth: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterArcanaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsArcana: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterHistoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsHistory: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterInvestigationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsInvestigation: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterNatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsNature: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterReligionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsReligion: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterAnimalHandlingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsAnimalHandling: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterInsightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsInsight: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterMedicineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsMedicine: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterPerceptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsPerception: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterSurvivalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsSurvival: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterDeceptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsDeception: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterIntimidationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsIntimidation: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterPerformanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsPerformance: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterPersuasionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsPersuasion: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterBlindsightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, sensesBlindsight: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterDarkvisionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, sensesDarkvision: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterTremorsenseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, sensesTremorsense: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterTruesightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, sensesTruesight: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterPassivePerceptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, sensesPassivePerception: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterPassiveInvestigationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, sensesPassiveInvestigation: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterPassiveInsightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, sensesPassiveInsight: this.stringToNumber(event.target.value) }
		})
	}

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
		//let cookieManager = new CookieManager()
		let diceRegex = /^\d+d\d+$/
		let baseHitPointsError = !((this.state.monster.hitPoints != null) && this.state.monster.hitPoints >= 0)
		let hitPointDiceError = !((this.state.monster.hitPointDice != null) && this.state.monster.hitPointDice.match(diceRegex) != null)
		let armorClassError = this.state.monster.armorClass < 0
		let strStatError = this.state.monster.strStat < 0
		let dexStatError = this.state.monster.dexStat < 0
		let conStatError = this.state.monster.conStat < 0
		let intStatError = this.state.monster.intStat < 0
		let wisStatError = this.state.monster.wisStat < 0
		let chaStatError = this.state.monster.chaStat < 0
		let challengeRatingError = this.state.monster.challengeRating < 0
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
					<h1 className="page-title">Create a Monster</h1>
					<Grid container spacing={24}>
						<Grid item xs={12}>
							<div className="form-group">
								<TextField autoFocus error={false} margin="dense" value={this.state.monster.name} id="name" label="Monster Name" helperText="" fullWidth required onChange={this.handleMonsterNameChange}/>
							</div>
						</Grid>
						<Grid item xs={6}>
							<MonsterTypeDropdown type={this.state.monster.type} onChange={this.handleMonsterTypeChange} />
						</Grid>
						<Grid item xs={6}>
							<MonsterSizeDropdown type={this.state.monster.size} onChange={this.handleMonsterSizeChange} />
						</Grid>
						<Grid item xs={6}>
							<MonsterRaceDropdown type={this.state.monster.race} onChange={this.handleMonsterRaceChange} />
						</Grid>
						<Grid item xs={6}>
							<MonsterAlignmentDropdown type={this.state.monster.alignment} onChange={this.handleMonsterAlignmentChange} />
						</Grid>
						<Grid item xs={6}>
							<MonsterEnvironmentDropdown type={this.state.monster.environment} onChange={this.handleMonsterEnvironmentChange} error={false} errorMessage=""/>
						</Grid>
						<Grid item xs={12}>
							<div className="form-group">
								<TextField error={false} margin="dense" value={this.state.monster.resistance} id="resistance" label="Resistances" helperText="" fullWidth onChange={this.handleMonsterResistanceChange}/>
							</div>
						</Grid>
						<Grid item xs={12}>
							<div className="form-group">
								<TextField error={false} margin="dense" value={this.state.monster.damageImmunity} id="damageImmunity" label="Damage Immunities" helperText="" fullWidth onChange={this.handleMonsterDamageImmunityChange}/>
							</div>
						</Grid>
						<Grid item xs={12}>
							<div className="form-group">
								<TextField error={false} margin="dense" value={this.state.monster.conditionImmunity} id="conditionImmunity" label="Condition Immunities" helperText="" fullWidth onChange={this.handleMonsterConditionImmunityChange}/>
							</div>
						</Grid>
						<Grid item xs={12}>
							<div className="form-group">
								<TextField error={false} margin="dense" value={this.state.monster.vulnerability} id="vulnerability" label="Vulnerabilities" helperText="" fullWidth onChange={this.handleMonsterVulnerabilityChange}/>
							</div>
						</Grid>
						<Grid item xs={6}>
							<div className="form-group">
								<TextField error = {armorClassError} id="armorClass" label="Armor Class" value={this.state.monster.armorClass} helperText={armorClassError ? "Your armor class must be above 0" : ""} onChange={this.handleMonsterArmorClassChange} type="number" InputLabelProps={{ shrink: true }} required margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={6}>
							<div className="form-group">
								<TextField error = {baseHitPointsError} helperText={baseHitPointsError? "You cannot have a negative base HP." : ""} id="hitPoints" label="Hit Points" value={this.state.monster.hitPoints} onChange={this.handleMonsterHitPointsChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={6}>
							<div className="form-group">
								<TextField error={hitPointDiceError} helperText={hitPointDiceError? "You must provide your hitpoint dice in the xdy format (i.e. 4d6)" : ""} margin="dense" value={this.state.monster.hitPointDice} id="hitPointDice" label="Hit Point Dice" fullWidth required onChange={this.handleMonsterHitPointDiceChange}/>
							</div>
						</Grid>
						<Grid item xs={6}>
							<div className="form-group">
								<TextField error = {false} id="hitPointModifier" label="Base Hit Point Modifier" value={this.state.monster.hitPointDiceAdd} onChange={this.handleMonsterHitPointDiceModifierChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={6}>
							<div className="form-group">
								<TextField error = {landSpeedError} helperText={landSpeedError? "You cannot have a negative land speed." : ""} required id="landSpeed" label="Land Speed" value={this.state.monster.speedLand} onChange={this.handleMonsterLandSpeedChange} type="number" InputLabelProps={{ shrink: true }} margin="normal" InputProps={{ endAdornment: <InputAdornment position="end">ft</InputAdornment>, }}/>
							</div>
						</Grid>
						<Grid item xs={6}>
							<div className="form-group">
								<TextField error = {swimmingSpeedError} helperText={swimmingSpeedError? "You cannot have a negative swimming speed." : ""}id="swimmingSpeed" label="Swimming Speed" value={this.state.monster.speedSwim} onChange={this.handleMonsterSwimSpeedChange} type="number" InputLabelProps={{ shrink: true }} margin="normal" InputProps={{ endAdornment: <InputAdornment position="end">ft</InputAdornment>, }}/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {strStatError} helperText={strStatError? "You cannot have a negative strength stat." : ""} required id="strength" label="Strength Stat" value={this.state.monster.strStat} onChange={this.handleMonsterStrStatChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {dexStatError} helperText={dexStatError? "You cannot have a negative dexterity stat." : ""} required id="dexterity" label="Dexterity Stat" value={this.state.monster.dexStat} onChange={this.handleMonsterDexStatChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {conStatError} helperText={conStatError? "You cannot have a negative constitution stat." : ""} required id="constitution" label="Constitution Stat" value={this.state.monster.conStat} onChange={this.handleMonsterConStatChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {intStatError} helperText={intStatError? "You cannot have a negative intelligence stat." : ""} required id="intelligence" label="Intelligence Stat" value={this.state.monster.intStat} onChange={this.handleMonsterIntStatChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {wisStatError} helperText={wisStatError? "You cannot have a negative wisdom stat." : ""} required id="wisdom" label="Wisdom Stat" value={this.state.monster.wisStat} onChange={this.handleMonsterWisStatChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {chaStatError} helperText={chaStatError? "You cannot have a negative charisma stat." : ""} required id="charisma" label="Charisma Stat" value={this.state.monster.chaStat} onChange={this.handleMonsterChaStatChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="strengthSavingThrow" label="Strength Saving Throw Modifier" value={this.state.monster.strSavingThrow} onChange={this.handleMonsterStrSavingThrowChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="dexteritySavingThrow" label="Dexterity Saving Throw Modifier" value={this.state.monster.dexSavingThrow} onChange={this.handleMonsterDexSavingThrowChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="constitutionSavingThrow" label="Constitution Saving Throw Modifier" value={this.state.monster.conSavingThrow} onChange={this.handleMonsterConSavingThrowChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="intelligenceSavingThrow" label="Intelligence Saving Throw Modifier" value={this.state.monster.intSavingThrow} onChange={this.handleMonsterIntSavingThrowChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="wisdomSavingThrow" label="Wisdom Saving Throw Modifier" value={this.state.monster.wisSavingThrow} onChange={this.handleMonsterWisSavingThrowChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div className="form-group">
								<TextField error = {false} id="charismaSavingThrow" label="Charisma Saving Throw Modifier" value={this.state.monster.chaSavingThrow} onChange={this.handleMonsterChaSavingThrowChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
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
