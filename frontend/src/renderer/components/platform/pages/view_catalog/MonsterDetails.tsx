import * as React from 'react';
import { Input, Control, Label, Button, Tile, Subtitle } from 'bloomer';
import * as MonsterInterface from '../../../../../monster';

import 'bulma/css/bulma.css';

export interface IMonsterDetailsState {
	monster: MonsterInterface.IMonsterData,
}

export class MonsterDetails extends React.Component<any, IMonsterDetailsState> {
	constructor(props: any) {
		super(props);
		this.state = {
			monster: this.props.monster,
		}
		this.preprocessMissingMonsterData();
	}

	isEmptyObject(obj: MonsterInterface.IMonsterData) {
		for(var key in obj) {
			if(obj.hasOwnProperty(key))
				return false;
		}
		return true;
	}

	// Hopefully, the backend will return the monster in the correct format
	// For now, we are not getting the Skills, Senses, etc.
	// Once the backend is fixed, we can get rid of this function.
	preprocessMissingMonsterData() {
		let monster = this.state.monster;
		if(monster.AbilityScores == null){
			monster.AbilityScores = {} as MonsterInterface.IMonsterAbilityScore;
		}
		if(monster.SavingThrows == null){
			monster.SavingThrows = {} as MonsterInterface.IMonsterSavingThrow;
		}
		if(monster.Skills == null){
			monster.Skills = {} as MonsterInterface.SkillMap;
		}
		if(monster.Senses == null){
			monster.Senses = {} as MonsterInterface.SenseMap;
		}
	}

	isExists(attribute: string | number | undefined) {
		if(attribute == undefined){
			return "N/A";
		}
		else{
			return attribute;
		}
	}

	render() {
		if(!this.isEmptyObject(this.state.monster)) {
			let monster = this.state.monster;
			return (
				<form>
					<h1 className="page-title">Monster Details</h1>
						<Control>
							<Label>Monster Name</Label>
							<Input  value={this.isExists(monster.Name)} id="name" label="Monster Name" readOnly/>
						</Control>
						<Tile className="box" isVertical>
							<Subtitle>Basic Configurations</Subtitle>
							<Control>
								<Label>Type</Label>
								<Input value={this.isExists(monster.Type)} label="Type" readOnly/>
							</Control>
							<Control>
								<Label>Size</Label>
								<Input value={this.isExists(monster.Size)} label="Size" readOnly/>
							</Control>
							<Control>
								<Label>Race</Label>
								<Input value={this.isExists(monster.Race)} label="Race" readOnly/>
							</Control>
							<Control>
								<Label>Alignment</Label>
								<Input value={this.isExists(monster.Alignment)} label="Alignment" readOnly/>
							</Control>
							<Control>
								<Label>Environment</Label>
								<Input value={this.isExists(monster.Environment)} label="Environment" readOnly/>
							</Control>
						</Tile>

						<Tile className="box" isVertical>
							<Subtitle>Vulnerability, Resistance, and Immunity</Subtitle>
							<Control>
								<Label>Resistance</Label>
								<Input  value={this.isExists(monster.DamageResistances)} label="Resistance" readOnly/>
							</Control>
							<Control>
								<Label>Damage Immunity</Label>
								<Input  value={this.isExists(monster.DamageImmunities)} label="Damage Immunity" readOnly/>
							</Control>
							<Control>
								<Label>Condition Immunity</Label>
								<Input  value={this.isExists(monster.ConditionImmunities)} label="Condition Immunity" readOnly/>
							</Control>
							<Control>
								<Label>Damage Vulnerabilities</Label>
								<Input  value={this.isExists(monster.DamageVulnerabilities)} label="Vulnerability" readOnly/>
							</Control>
						</Tile>
						<Control>
							<Label>Armor Class</Label>
							<Input  value={this.isExists(monster.ArmorClass)} label="Armor Class" readOnly/>
						</Control>
						<Control>
							<Label>Hit Points</Label>
							<Input  value={this.isExists(monster.HitPoints)} label="Hit Points" readOnly/>
						</Control>
						<Control>
							<Label>Hit Point Distribution</Label>
							<Input  value={this.isExists(monster.HitPointDistribution)} label="Hit Point Dice" readOnly/>
						</Control>

						<Control>
							<Label>Strength Stat</Label>
							<Input  value={this.isExists(monster.AbilityScores.Strength)} label="Strength Stat" readOnly/>
						</Control>
						<Control>
							<Label>Dexterity Stat</Label>
							<Input  value={this.isExists(monster.AbilityScores.Dexterity)} label="Dexterity Stat" readOnly/>
						</Control>
						<Control>
							<Label>Constitution Stat</Label>
							<Input  value={this.isExists(monster.AbilityScores.Constitution)} label="Constitution Stat" readOnly/>
						</Control>
						<Control>
							<Label>Intelligence Stat</Label>
							<Input  value={this.isExists(monster.AbilityScores.Intelligence)} label="Intelligence Stat" readOnly/>
						</Control>
						<Control>
							<Label>Wisdom Stat</Label>
							<Input  value={this.isExists(monster.AbilityScores.Wisdom)} label="Wisdom Stat" readOnly/>
						</Control>
						<Control>
							<Label>Charisma Stat</Label>
							<Input  value={this.isExists(monster.AbilityScores.Charisma)} label="Charisma Stat" readOnly/>
						</Control>

						<Control>
							<Label>Strength Saving Throw Modifier</Label>
							<Input  value={this.isExists(monster.SavingThrows.Strength)} label="Strength Saving Throw Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Dexterity Saving Throw Modifier</Label>
							<Input  value={this.isExists(monster.SavingThrows.Dexterity)} label="Dexterity Saving Throw Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Constitution Saving Throw Modifier</Label>
							<Input  value={this.isExists(monster.SavingThrows.Constitution)} label="Constitution Saving Throw Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Intelligence Saving Throw Modifier</Label>
							<Input  value={this.isExists(monster.SavingThrows.Intelligence)} label="Intelligence Saving Throw Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Wisdom Saving Throw Modifier</Label>
							<Input  value={this.isExists(monster.SavingThrows.Wisdom)} label="Wisdom Saving Throw Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Charisma Saving Throw Modifier</Label>
							<Input  value={this.isExists(monster.SavingThrows.Charisma)} label="Charisma Saving Throw Modifier" readOnly/>
						</Control>

						<Control>
							<Label>Athletics Modifier</Label>
							<Input  value={this.isExists(monster.Skills.Athletics)} label="Athletics Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Acrobatics Modifier</Label>
							<Input  value={this.isExists(monster.Skills.Acrobatics)} label="Acrobatics Modifier" readOnly/>
						</Control>

						<Control>
							<Label>Sleight of Hand Modifier</Label>
							<Input  value={this.isExists(monster.Skills.SleightOfHand)} label="Sleight of Hand Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Stealth Modifier</Label>
							<Input  value={this.isExists(monster.Skills.Stealth)} label="Stealth Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Arcana Modifier</Label>
							<Input  value={this.isExists(monster.Skills.Arcana)} label="Arcana Modifier" readOnly/>
						</Control>
						<Control>
							<Label>History Modifier</Label>
							<Input  value={this.isExists(monster.Skills.History)} label="History Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Investigation Modifier</Label>
							<Input  value={this.isExists(monster.Skills.Investigation)} label="Investigation Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Nature Modifier</Label>
							<Input  value={this.isExists(monster.Skills.Nature)} label="Nature Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Religion Modifier</Label>
							<Input  value={this.isExists(monster.Skills.Religion)} label="Religion Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Animal Handling Modifier</Label>
							<Input  value={this.isExists(monster.Skills.AnimalHandling)} label="Animal Handling Modifier" readOnly/>
						</Control>

						<Control>
							<Label>Insight Modifier</Label>
							<Input  value={this.isExists(monster.Skills.Insight)} label="Insight Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Medicine Modifier</Label>
							<Input  value={this.isExists(monster.Skills.Medicine)} label="Medicine Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Perception Modifier</Label>
							<Input  value={this.isExists(monster.Skills.Perception)} label="Perception Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Survival Modifier</Label>
							<Input  value={this.isExists(monster.Skills.Survival)} label="Survival Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Deception Modifier</Label>
							<Input  value={this.isExists(monster.Skills.Deception)} label="Deception Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Intimidation Modifier</Label>
							<Input  value={this.isExists(monster.Skills.Intimidation)} label="Intimidation Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Performance Modifier</Label>
							<Input  value={this.isExists(monster.Skills.Performance)} label="Performance Modifier" readOnly/>
						</Control>
						<Control>
							<Label>Persuasion Modifier</Label>
							<Input  value={this.isExists(monster.Skills.Persuasion)} label="Persuasion Modifier" readOnly/>
						</Control>

						{/*
						TODO: Since "Senses" are defined as a string, we can't access its properties like below
						      Change this once Senses are strcutured like Skills.
						<Control>
							<Label>Blindsight</Label>
							<Input  value={this.isExists(monster.Senses.Blindsight)} label="Blindsight" readOnly/>
						</Control>
						<Control>
							<Label>Darkvision</Label>
							<Input  value={this.isExists(monster.Senses.Darkvision)} label="Darkvision" readOnly/>
						</Control>
						<Control>
							<Label>Tremorsense</Label>
							<Input  value={this.isExists(monster.Senses.Tremorsense)} label="Tremorsense" readOnly/>
						</Control>
						<Control>
							<Label>Truesight</Label>
							<Input  value={this.isExists(monster.Senses.Truesight)} label="Truesight" readOnly/>
						</Control>
						<Control>
							<Label>Passive Perception</Label>
							<Input  value={this.isExists(monster.Senses.PassivePerception)} label="Passive Perception" readOnly/>
						</Control>
						<Control>
							<Label>Passive Investigation</Label>
							<Input  value={this.isExists(monster.Senses.PassiveInvestigation)} label="Passive Investigation" readOnly/>
						</Control>
						<Control>
							<Label>Passive Insight</Label>
							<Input  value={this.isExists(monster.Senses.PassiveInsight)} label="Passive Insight" readOnly/>
						</Control>
						*/}
						<Control>
							<Label>Languages</Label>
							<Input  value={this.isExists(monster.Languages)} label="Languages" readOnly/>
						</Control>
						<Control>
							<Label>Challenge Rating</Label>
							<Input  value={this.isExists(monster.ChallengeRating)} label="Challenge Rating" readOnly/>
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