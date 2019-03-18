import * as React from 'react';
import { Input, Control, Label, Button, Tile, Subtitle } from 'bloomer';
import * as MonsterInterface from '../../../../../monster';

import 'bulma/css/bulma.css';

export interface IMonsterDetailsState {
	monster: MonsterInterface.IMonster,
}

export class MonsterDetails extends React.Component<any, IMonsterDetailsState> {
	constructor(props: any) {
		super(props);
		this.state = {
			monster: this.props.monster,
		}
	}

	isEmptyObject(obj: MonsterInterface.IMonster) {
		for(var key in obj) {
			if(obj.hasOwnProperty(key))
				return false;
		}
		return true;
	}

	render() {
		if(!this.isEmptyObject(this.state.monster)) {
			let monster = this.state.monster;
			return (
				<form>
					<h1 className="page-title">Monster Details</h1>
						<Control>
							<Label>Monster Name</Label>
							<Input  value={monster.name} id="name" label="Monster Name" readOnly/>
						</Control>
						<Tile className="box" isVertical>
							<Subtitle>Basic Configurations</Subtitle>
							<Control>
								<Label>Type</Label>
								<Input value={MonsterInterface.MonsterTypeNames.get(monster.type)} label="Type" readOnly/>
							</Control>
							<Control>
								<Label>Size</Label>
								<Input value={MonsterInterface.MonsterSizeNames.get(monster.size)} label="Size" readOnly/>
							</Control>
							<Control>
								<Label>Race</Label>
								<Input value={MonsterInterface.MonsterRaceNames.get(monster.race)} label="Race" readOnly/>
							</Control>
							<Control>
								<Label>Alignment</Label>
								<Input value={MonsterInterface.MonsterAlignmentNames.get(monster.alignment)} label="Alignment" readOnly/>
							</Control>
							<Control>
								<Label>Environment</Label>
								<Input value={MonsterInterface.MonsterEnvironmentNames.get(monster.environment)} label="Environment" readOnly/>
							</Control>
						</Tile>

						<Tile className="box" isVertical>
							<Subtitle>Vulnerability, Resistance, and Immunity</Subtitle>
							<Control>
								<Label>Resistance</Label>
								<Input  value={monster.resistance} label="Resistance" readOnly/>
							</Control>
							<Control>
								<Label>Damage Immunity</Label>
								<Input  value={monster.damageImmunity} label="Damage Immunity" readOnly/>
							</Control>
							<Control>
								<Label>Condition Immunity</Label>
								<Input  value={monster.conditionImmunity} label="Condition Immunity" readOnly/>
							</Control>
							<Control>
								<Label>Vulnerability</Label>
								<Input  value={monster.vulnerability} label="Vulnerability" readOnly/>
							</Control>
						</Tile>
						<Control>
							<Label>Armor Class</Label>
							<Input  value={monster.armorClass} label="Armor Class" readOnly/>
						</Control>
						<Control>
							<Label>Hit Points</Label>
							<Input  value={monster.hitPoints} label="Hit Points" readOnly/>
						</Control>
						<Control>
							<Label>Hit Point Dice</Label>
							<Input  value={monster.hitPointDice} label="Hit Point Dice" readOnly/>
						</Control>
						<Control>
							<Label>Hit Point Dice Add</Label>
							<Input  value={monster.hitPointDiceAdd} label="Hit Point Dice Add" readOnly/>
						</Control>

						<Control>
							<Label>Land Speed</Label>
							<Input  value={monster.speedLand} label="Land Speed" readOnly/>
						</Control>
						<Control>
							<Label>Swimming Speed</Label>
							<Input  value={monster.speedSwim} label="Swimming Speed" readOnly/>
						</Control>
						<Control>
							<Label>Strength Stat</Label>
							<Input  value={monster.strStat} label="Strength Stat" readOnly/>
						</Control>
						<Control>
							<Label>Dexterity Stat</Label>
							<Input  value={monster.dexStat} label="Dexterity Stat" readOnly/>
						</Control>
						<Control>
							<Label>Constitution Stat</Label>
							<Input  value={monster.conStat} label="Constitution Stat" readOnly/>
						</Control>
						<Control>
							<Label>Intelligence Stat</Label>
							<Input  value={monster.intStat} label="Intelligence Stat" readOnly/>
						</Control>
						<Control>
							<Label>Wisdom Stat</Label>
							<Input  value={monster.wisStat} label="Wisdom Stat" readOnly/>
						</Control>
						<Control>
							<Label>Charisma Stat</Label>
							<Input  value={monster.chaStat} label="Charisma Stat" readOnly/>
						</Control>

						<Control>
							<Label>Strength Saving Throw Modifier</Label>
							<Input  value={monster.strSavingThrow} label="Strength Saving Throw Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Dexterity Saving Throw Modifier</Label>
							<Input  value={monster.dexSavingThrow} label="Dexterity Saving Throw Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Constitution Saving Throw Modifier</Label>
							<Input  value={monster.conSavingThrow} label="Constitution Saving Throw Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Intelligence Saving Throw Modifier</Label>
							<Input  value={monster.intSavingThrow} label="Intelligence Saving Throw Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Wisdom Saving Throw Modifier</Label>
							<Input  value={monster.wisSavingThrow} label="Wisdom Saving Throw Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Charisma Saving Throw Modifier</Label>
							<Input  value={monster.chaSavingThrow} label="Charisma Saving Throw Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Athletics Modifier</Label>
							<Input  value={monster.skillsAthletics} label="Athletics Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Acrobatics Modifier</Label>
							<Input  value={monster.skillsAcrobatics} label="Acrobatics Modifier" readOnly/>
						</Control>

						<Control>
							<Label>Sleight of Hand Modifier</Label>
							<Input  value={monster.skillsSleightOfHand} label="Sleight of Hand Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Stealth Modifier</Label>
							<Input  value={monster.skillsStealth} label="Stealth Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Arcana Modifier</Label>
							<Input  value={monster.skillsArcana} label="Arcana Modifier" readOnly/>
						</Control>
						<Control>
							<Label>History Modifier</Label>
							<Input  value={monster.skillsHistory} label="History Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Investigation Modifier</Label>
							<Input  value={monster.skillsInvestigation} label="Investigation Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Nature Modifier</Label>
							<Input  value={monster.skillsNature} label="Nature Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Religion Modifier</Label>
							<Input  value={monster.skillsReligion} label="Religion Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Animal Handling Modifier</Label>
							<Input  value={monster.skillsAnimalHandling} label="Animal Handling Modifier" readOnly/>
						</Control>

						<Control>
							<Label>Insight Modifier</Label>
							<Input  value={monster.skillsInsight} label="Insight Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Medicine Modifier</Label>
							<Input  value={monster.skillsMedicine} label="Medicine Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Perception Modifier</Label>
							<Input  value={monster.skillsPerception} label="Perception Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Survival Modifier</Label>
							<Input  value={monster.skillsSurvival} label="Survival Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Deception Modifier</Label>
							<Input  value={monster.skillsDeception} label="Deception Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Intimidation Modifier</Label>
							<Input  value={monster.skillsIntimidation} label="Intimidation Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Performance Modifier</Label>
							<Input  value={monster.skillsPerformance} label="Performance Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Persuasion Modifier</Label>
							<Input  value={monster.skillsPersuasion} label="Persuasion Modifier" readOnly/>
						</Control>

						<Control>
							<Label>Blindsight</Label>
							<Input  value={monster.sensesBlindsight} label="Blindsight" readOnly/>
						</Control>
						<Control>
							<Label>Darkvision</Label>
							<Input  value={monster.sensesDarkvision} label="Darkvision" readOnly/>
						</Control>
						<Control>
							<Label>Tremorsense</Label>
							<Input  value={monster.sensesTremorsense} label="Tremorsense" readOnly/>
						</Control>
						<Control>
							<Label>Truesight</Label>
							<Input  value={monster.sensesTruesight} label="Truesight" readOnly/>
						</Control>
						<Control>
							<Label>Passive Perception</Label>
							<Input  value={monster.sensesPassivePerception} label="Passive Perception" readOnly/>
						</Control>
						<Control>
							<Label>Passive Investigation</Label>
							<Input  value={monster.sensesPassiveInvestigation} label="Passive Investigation" readOnly/>
						</Control>
						<Control>
							<Label>Passive Insight</Label>
							<Input  value={monster.sensesPassiveInsight} label="Passive Insight" readOnly/>
						</Control>
						<Control>
							<Label>Languages</Label>
							<Input  value={monster.languages} label="Languages" readOnly/>
						</Control>
						<Control>
							<Label>Challenge Rating</Label>
							<Input  value={monster.challengeRating} label="Challenge Rating" readOnly/>
						</Control>
						<Control>
							<Label>Experience Points</Label>
							<Input  value={monster.experiencePoints} label="Experience Points" readOnly/>
						</Control>
					<Button className="button" type="submit" disabled> Edit Monster </Button>
					<Button className="button" onClick = {this.props.resetParentState}> Return to Catalogue </Button>
				</form>
			);
		}
		else{
			return (<div>No monster is selected.</div>);
		}
	}
}