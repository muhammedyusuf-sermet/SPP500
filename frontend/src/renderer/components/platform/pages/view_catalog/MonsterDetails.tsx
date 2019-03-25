import * as React from 'react';
import { Input, Control, Label, Button, Tile, Subtitle } from 'bloomer';
import * as MonsterInterface from '../../../../../monster';

import 'bulma/css/bulma.css';

export interface IMonsterDetailsState {
	monster: MonsterInterface.IMonsterState,
}

export class MonsterDetails extends React.Component<any, IMonsterDetailsState> {
	constructor(props: any) {
		super(props);
		this.state = {
			monster: this.props.monster,
		}
	}

	isEmptyObject(obj: MonsterInterface.IMonsterState) {
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
							<Input  value={monster.Name} id="name" label="Monster Name" readOnly/>
						</Control>
						<Tile className="box" isVertical>
							<Subtitle>Basic Configurations</Subtitle>
							<Control>
								<Label>Type</Label>
								<Input value={monster.Type} label="Type" readOnly/>
							</Control>
							<Control>
								<Label>Size</Label>
								<Input value={monster.Size} label="Size" readOnly/>
							</Control>
							<Control>
								<Label>Race</Label>
								<Input value={monster.Race} label="Race" readOnly/>
							</Control>
							<Control>
								<Label>Alignment</Label>
								<Input value={monster.Alignment} label="Alignment" readOnly/>
							</Control>
							<Control>
								<Label>Environment</Label>
								<Input value={monster.Environment} label="Environment" readOnly/>
							</Control>
						</Tile>

						<Tile className="box" isVertical>
							<Subtitle>Vulnerability, Resistance, and Immunity</Subtitle>
							<Control>
								<Label>Resistance</Label>
								<Input  value={monster.DamageResistances} label="Resistance" readOnly/>
							</Control>
							<Control>
								<Label>Damage Immunity</Label>
								<Input  value={monster.DamageImmunities} label="Damage Immunity" readOnly/>
							</Control>
							<Control>
								<Label>Condition Immunity</Label>
								<Input  value={monster.ConditionImmunities} label="Condition Immunity" readOnly/>
							</Control>
							<Control>
								<Label>Damage Vulnerabilities</Label>
								<Input  value={monster.DamageVulnerabilities} label="Vulnerability" readOnly/>
							</Control>
						</Tile>
						<Control>
							<Label>Armor Class</Label>
							<Input  value={monster.ArmorClass} label="Armor Class" readOnly/>
						</Control>
						<Control>
							<Label>Hit Points</Label>
							<Input  value={monster.HitPoints} label="Hit Points" readOnly/>
						</Control>
						<Control>
							<Label>Hit Point Distribution</Label>
							<Input  value={monster.HitPointDistribution} label="Hit Point Dice" readOnly/>
						</Control>

						<Control>
							<Label>Strength Stat</Label>
							<Input  value={monster.AbilityScores.Strength} label="Strength Stat" readOnly/>
						</Control>
						<Control>
							<Label>Dexterity Stat</Label>
							<Input  value={monster.AbilityScores.Dexterity} label="Dexterity Stat" readOnly/>
						</Control>
						<Control>
							<Label>Constitution Stat</Label>
							<Input  value={monster.AbilityScores.Constitution} label="Constitution Stat" readOnly/>
						</Control>
						<Control>
							<Label>Intelligence Stat</Label>
							<Input  value={monster.AbilityScores.Intelligence} label="Intelligence Stat" readOnly/>
						</Control>
						<Control>
							<Label>Wisdom Stat</Label>
							<Input  value={monster.AbilityScores.Wisdom} label="Wisdom Stat" readOnly/>
						</Control>
						<Control>
							<Label>Charisma Stat</Label>
							<Input  value={monster.AbilityScores.Charisma} label="Charisma Stat" readOnly/>
						</Control>

						<Control>
							<Label>Strength Saving Throw Modifier</Label>
							<Input  value={monster.SavingThrows.Strength} label="Strength Saving Throw Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Dexterity Saving Throw Modifier</Label>
							<Input  value={monster.SavingThrows.Dexterity} label="Dexterity Saving Throw Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Constitution Saving Throw Modifier</Label>
							<Input  value={monster.SavingThrows.Constitution} label="Constitution Saving Throw Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Intelligence Saving Throw Modifier</Label>
							<Input  value={monster.SavingThrows.Intelligence} label="Intelligence Saving Throw Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Wisdom Saving Throw Modifier</Label>
							<Input  value={monster.SavingThrows.Wisdom} label="Wisdom Saving Throw Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Charisma Saving Throw Modifier</Label>
							<Input  value={monster.SavingThrows.Charisma} label="Charisma Saving Throw Modifier" readOnly/>
						</Control>

						<Control>
							<Label>Athletics Modifier</Label>
							<Input  value={monster.Skills.Athletics} label="Athletics Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Acrobatics Modifier</Label>
							<Input  value={monster.Skills.Acrobatics} label="Acrobatics Modifier" readOnly/>
						</Control>

						<Control>
							<Label>Sleight of Hand Modifier</Label>
							<Input  value={monster.Skills.SleightOfHand} label="Sleight of Hand Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Stealth Modifier</Label>
							<Input  value={monster.Skills.Stealth} label="Stealth Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Arcana Modifier</Label>
							<Input  value={monster.Skills.Arcana} label="Arcana Modifier" readOnly/>
						</Control>
						<Control>
							<Label>History Modifier</Label>
							<Input  value={monster.Skills.History} label="History Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Investigation Modifier</Label>
							<Input  value={monster.Skills.Investigation} label="Investigation Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Nature Modifier</Label>
							<Input  value={monster.Skills.Nature} label="Nature Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Religion Modifier</Label>
							<Input  value={monster.Skills.Religion} label="Religion Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Animal Handling Modifier</Label>
							<Input  value={monster.Skills.AnimalHandling} label="Animal Handling Modifier" readOnly/>
						</Control>

						<Control>
							<Label>Insight Modifier</Label>
							<Input  value={monster.Skills.Insight} label="Insight Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Medicine Modifier</Label>
							<Input  value={monster.Skills.Medicine} label="Medicine Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Perception Modifier</Label>
							<Input  value={monster.Skills.Perception} label="Perception Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Survival Modifier</Label>
							<Input  value={monster.Skills.Survival} label="Survival Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Deception Modifier</Label>
							<Input  value={monster.Skills.Deception} label="Deception Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Intimidation Modifier</Label>
							<Input  value={monster.Skills.Intimidation} label="Intimidation Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Performance Modifier</Label>
							<Input  value={monster.Skills.Performance} label="Performance Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Persuasion Modifier</Label>
							<Input  value={monster.Skills.Persuasion} label="Persuasion Modifier" readOnly/>
						</Control>

						{/*
						TODO: Since "Senses" are defined as a string, we can't access its properties like below
						      Change this once Senses are strcutured like Skills.
						<Control>
							<Label>Blindsight</Label>
							<Input  value={monster.Senses.Blindsight} label="Blindsight" readOnly/>
						</Control>
						<Control>
							<Label>Darkvision</Label>
							<Input  value={monster.Senses.Darkvision} label="Darkvision" readOnly/>
						</Control>
						<Control>
							<Label>Tremorsense</Label>
							<Input  value={monster.Senses.Tremorsense} label="Tremorsense" readOnly/>
						</Control>
						<Control>
							<Label>Truesight</Label>
							<Input  value={monster.Senses.Truesight} label="Truesight" readOnly/>
						</Control>
						<Control>
							<Label>Passive Perception</Label>
							<Input  value={monster.Senses.PassivePerception} label="Passive Perception" readOnly/>
						</Control>
						<Control>
							<Label>Passive Investigation</Label>
							<Input  value={monster.Senses.PassiveInvestigation} label="Passive Investigation" readOnly/>
						</Control>
						<Control>
							<Label>Passive Insight</Label>
							<Input  value={monster.Senses.PassiveInsight} label="Passive Insight" readOnly/>
						</Control>
						*/}
						<Control>
							<Label>Languages</Label>
							<Input  value={monster.Languages} label="Languages" readOnly/>
						</Control>
						<Control>
							<Label>Challenge Rating</Label>
							<Input  value={monster.ChallengeRating} label="Challenge Rating" readOnly/>
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