import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import * as MonsterInterface from '../../../../../monster';

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
					<Grid container spacing={24}>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.name} id="name" label="Monster Name" fullWidth InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={6}>
							<TextField value={MonsterInterface.MonsterTypeNames.get(monster.type)} label="Type" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={6}>
							<TextField value={MonsterInterface.MonsterSizeNames.get(monster.size)} label="Size" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={6}>
							<TextField value={MonsterInterface.MonsterRaceNames.get(monster.race)} label="Race" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={6}>
							<TextField value={MonsterInterface.MonsterAlignmentNames.get(monster.alignment)} label="Alignment" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={6}>
							<TextField value={MonsterInterface.MonsterEnvironmentNames.get(monster.environment)} label="Environment" InputProps={{readOnly: true}}/>
						</Grid>

						<Grid item xs={12}>
							<TextField margin="dense" value={monster.resistance} label="Resistance" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.damageImmunity} label="Damage Immunity" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.conditionImmunity} label="Condition Immunity" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.vulnerability} label="Vulnerability" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.armorClass} label="Armor Class" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.hitPoints} label="Hit Points" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.hitPointDice} label="Hit Point Dice" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.hitPointDiceAdd} label="Hit Point Dice Add" InputProps={{readOnly: true}}/>
						</Grid>

						<Grid item xs={12}>
							<TextField margin="dense" value={monster.speedLand} label="Land Speed" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.speedSwim} label="Swimming Speed" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.strStat} label="Strength Stat" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.dexStat} label="Dexterity Stat" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.conStat} label="Constitution Stat" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.intStat} label="Intelligence Stat" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.wisStat} label="Wisdom Stat" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.chaStat} label="Charisma Stat" InputProps={{readOnly: true}}/>
						</Grid>

						<Grid item xs={12}>
							<TextField margin="dense" value={monster.strSavingThrow} label="Strength Saving Throw Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.dexSavingThrow} label="Dexterity Saving Throw Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.conSavingThrow} label="Constitution Saving Throw Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.intSavingThrow} label="Intelligence Saving Throw Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.wisSavingThrow} label="Wisdom Saving Throw Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.chaSavingThrow} label="Charisma Saving Throw Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsAthletics} label="Athletics Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsAcrobatics} label="Acrobatics Modifier" InputProps={{readOnly: true}}/>
						</Grid>

						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsSleightOfHand} label="Sleight of Hand Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsStealth} label="Stealth Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsArcana} label="Arcana Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsHistory} label="History Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsInvestigation} label="Investigation Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsNature} label="Nature Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsReligion} label="Religion Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsAnimalHandling} label="Animal Handling Modifier" InputProps={{readOnly: true}}/>
						</Grid>

						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsInsight} label="Insight Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsMedicine} label="Medicine Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsPerception} label="Perception Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsSurvival} label="Survival Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsDeception} label="Deception Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsIntimidation} label="Intimidation Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsPerformance} label="Performance Modifier" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.skillsPersuasion} label="Persuasion Modifier" InputProps={{readOnly: true}}/>
						</Grid>

						<Grid item xs={12}>
							<TextField margin="dense" value={monster.sensesBlindsight} label="Blindsight" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.sensesDarkvision} label="Darkvision" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.sensesTremorsense} label="Tremorsense" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.sensesTruesight} label="Truesight" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.sensesPassivePerception} label="Passive Perception" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.sensesPassiveInvestigation} label="Passive Investigation" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.sensesPassiveInsight} label="Passive Insight" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.languages} label="Languages" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.challengeRating} label="Challenge Rating" InputProps={{readOnly: true}}/>
						</Grid>
						<Grid item xs={12}>
							<TextField margin="dense" value={monster.experiencePoints} label="Experience Points" InputProps={{readOnly: true}}/>
						</Grid>
					<Button className="button" variant="contained" color="primary" type="submit" disabled> Edit Monster </Button>
					<Button className="button" variant="contained" onClick = {this.props.resetParentState}> Return to Catalogue </Button>
					</Grid>
				</form>
			);
		}
		else{
			return (<div>No monster is selected.</div>);
		}
	}
}