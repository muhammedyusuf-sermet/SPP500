import React from 'react';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

import * as Monster from "../../monster";

import "../css/create_monster.css"


const types = Array.from(Monster.MonsterTypeNames.values()).map(v => ({label: v, value: v}))
const sizes = Array.from(Monster.MonsterSizeNames.values()).map(v => ({label: v, value: v}))
const races = Array.from(Monster.MonsterRaceNames.values()).map(v => ({label: v, value: v}))
const environments = Array.from(Monster.MonsterEnvironmentNames.values()).map(v => ({label: v, value: v}))
const alignments = Array.from(Monster.MonsterAlignmentNames.values()).map(v => ({label: v, value: v}))

const validateForm = (event: React.FormEvent) => {
	//console.log("Hello!")
	event.preventDefault();
}

interface IMonsterTypeDropdownProps {
	type: Monster.MonsterType,
	onChange: (newType: Monster.MonsterType) => void
}

const MonsterTypeDropdown = (props: IMonsterTypeDropdownProps) => (
	<TextField error={false} id="type" select value={Monster.MonsterTypeNames.get(props.type)} label="Type" helperText="" margin="normal" onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
		let val = Array.from(Monster.MonsterTypeNames.entries()).find((v) => v[1] === event.target.value)
		if (val !== undefined)
			props.onChange(val[0])
		}}>
		{types.map(option => (
			<MenuItem key={option.value} value={option.value} selected={Monster.MonsterTypeNames.get(props.type) === option.value}>
				{option.label}
			</MenuItem>
		))}
	</TextField>
)

interface IMonsterSizeDropdownProps {
	type: Monster.MonsterSize,
	onChange: (newSize: Monster.MonsterSize) => void
}

const MonsterSizeDropdown = (props: IMonsterSizeDropdownProps) => (
	    <TextField error={false} id="size" select value={Monster.MonsterSizeNames.get(props.type)} label="Size" helperText="" margin="normal" onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
	        let val = Array.from(Monster.MonsterSizeNames.entries()).find((v) => v[1] === event.target.value)
	        if (val !== undefined)
	            props.onChange(val[0])
	        }}>
	        {sizes.map(option => (
	            <MenuItem key={option.value} value={option.value} selected={Monster.MonsterSizeNames.get(props.type) === option.value}>
	                {option.label}
	            </MenuItem>
	        ))}
	    </TextField>
)

interface IMonsterRaceDropdownProps {
	    type: Monster.MonsterRace,
	    onChange: (newRace: Monster.MonsterRace) => void
	}

const MonsterRaceDropdown = (props: IMonsterRaceDropdownProps) => (
        <TextField error={false} id="race" select value={Monster.MonsterRaceNames.get(props.type)} label="Race" helperText="" margin="normal" onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            let val = Array.from(Monster.MonsterRaceNames.entries()).find((v) => v[1] === event.target.value)
            if (val !== undefined)
                props.onChange(val[0])
            }}>
            {races.map(option => (
                <MenuItem key={option.value} value={option.value} selected={Monster.MonsterRaceNames.get(props.type) === option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
)

interface IMonsterEnvironmentDropdownProps {
	type: Monster.MonsterEnvironment,
	onChange: (newEnvironment: Monster.MonsterEnvironment) => void
}

const MonsterEnvironmentDropdown = (props: IMonsterEnvironmentDropdownProps) => (
        <TextField error={false} id="environment" select value={Monster.MonsterEnvironmentNames.get(props.type)} label="Environment" helperText="" margin="normal" onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            let val = Array.from(Monster.MonsterEnvironmentNames.entries()).find((v) => v[1] === event.target.value)
            if (val !== undefined)
                props.onChange(val[0])
            }}>
            {environments.map(option => (
                <MenuItem key={option.value} value={option.value} selected={Monster.MonsterEnvironmentNames.get(props.type) === option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
)

interface IMonsterAlignmentDropdownProps {
    type: Monster.MonsterAlignment,
    onChange: (newAlignment: Monster.MonsterAlignment) => void
}

const MonsterAlignmentDropdown = (props: IMonsterAlignmentDropdownProps) => (
        <TextField error={false} id="alignment" select value={Monster.MonsterAlignmentNames.get(props.type)} label="Alignment" helperText="" margin="normal" onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            let val = Array.from(Monster.MonsterAlignmentNames.entries()).find((v) => v[1] === event.target.value)
            if (val !== undefined)
                props.onChange(val[0])
            }}>
            {alignments.map(option => (
                <MenuItem key={option.value} value={option.value} selected={Monster.MonsterAlignmentNames.get(props.type) === option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
)

interface IMonsterCreationState {
	monster: Monster.IMonster
}

export class MonsterCreation extends React.Component<{}, IMonsterCreationState> {
	constructor(props: {}) {
		super(props)
		this.state = {
			monster: {
				name: "",
				type: Monster.MonsterType.Aberration,
				alignment: Monster.MonsterAlignment.AnyAlignment,
				size: Monster.MonsterSize.Medium,
				race: Monster.MonsterRace.AnyRace,
				environment: Monster.MonsterEnvironment.Arctic,
				resistance: "",
				damageImmunity: "",
				conditionImmunity: "",
				vulnerability: "",
				armorClass: 13,
				hitPoints: 150,
				hitPointDice: "",
				hitPointDiceAdd: 3,
				speedLand: 30,
				speedSwim: 30,
				strStat: 10,
				dexStat: 10,
				conStat: 10,
				intStat: 10,
				wisStat: 10,
				chaStat: 10,
				strSavingThrow: 2,
				dexSavingThrow: 2,
				conSavingThrow: 2,
				intSavingThrow: 2,
				wisSavingThrow: 2,
				chaSavingThrow: 2,
				skillsAthletics: 0,
				skillsAcrobatics: 0,
				skillsSleightOfHand: 0,
				skillsStealth: 0,
				skillsArcana: 0,
				skillsHistory: 0,
				skillsInvestigation: 0,
				skillsNature: 0,
				skillsReligion: 0,
				skillsAnimalHandling: 0,
				skillsInsight: 0,
				skillsMedicine: 0,
				skillsPerception: 0,
				skillsSurvival: 0,
				skillsDeception: 0,
				skillsIntimidation: 0,
				skillsPerformance: 0,
				skillsPersuasion: 0,
				sensesBlindsight: 0,
				sensesDarkvision: 60,
				sensesTremorsense: 0,
				sensesTruesight: 0,
				sensesPassivePerception: 15,
				sensesPassiveInvestigation: 15,
				sensesPassiveInsight: 15,
				languages: "Common",
				challengeRating: 0.5,
				experiencePoints: 200,
				abilities: [],
				actions: [],
			}
		}
	}

	stringToNumber = (toConvert : string) => {
		return parseInt(toConvert) != NaN ? parseInt(toConvert) : 0
	}

	stringToFloat = (toConvert : string) => {
		return parseFloat(toConvert) != NaN ? parseFloat(toConvert) : 0
	}

	handleMonsterNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, name: event.target.value }
		})
	}

	handleMonsterTypeChange = (newType: Monster.MonsterType) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, type: newType }
		})
	}

	handleMonsterSizeChange = (newSize: Monster.MonsterSize) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, size: newSize }
		})
	}

	handleMonsterRaceChange = (newRace: Monster.MonsterRace) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, race: newRace }
		})
	}
	handleMonsterEnvironmentChange = (newEnvironment: Monster.MonsterEnvironment) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, environment: newEnvironment }
		})
	}
	handleMonsterAlignmentChange = (newAlignment: Monster.MonsterAlignment) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, alignment: newAlignment }
		})
	}

	handleMonsterResistanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, resistance: event.target.value }
		})
	}

	handleMonsterDamageImmunityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, damageImmunity: event.target.value }
		})
	}

	handleMonsterConditionImmunityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, conditionImmunity: event.target.value }
		})
	}

	handleMonsterVulnerabilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, vulnerability: event.target.value }
		})
	}

	handleMonsterArmorClassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, armorClass: this.stringToNumber(event.target.value)}
		})
	}

	handleMonsterHitPointsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, hitPoints: this.stringToNumber(event.target.value)}
		})
	}

	handleMonsterHitPointDiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, hitPointDice: event.target.value }
		})
	}

	handleMonsterHitPointDiceModifierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, hitPointDiceAdd: this.stringToNumber(event.target.value)}
		})
	}

	handleMonsterLandSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, speedLand: this.stringToNumber(event.target.value)}
		})
	}

	handleMonsterSwimSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, speedSwim: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterStrStatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, strStat: this.stringToNumber(event.target.value)}
		})
	}

	handleMonsterDexStatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, dexStat: this.stringToNumber(event.target.value)}
		})
	}

	handleMonsterConStatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, conStat: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterIntStatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, intStat: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterWisStatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, wisStat: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterChaStatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, chaStat: this.stringToNumber(event.target.value)}
		})
	}

	handleMonsterStrSavingThrowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, strSavingThrow: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterDexSavingThrowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, dexSavingThrow: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterConSavingThrowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, conSavingThrow: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterIntSavingThrowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, intSavingThrow: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterWisSavingThrowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, wisSavingThrow: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterChaSavingThrowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, chaSavingThrow: this.stringToNumber(event.target.value) }
		})
	}

	handleMonsterAthleticsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const monster = this.state.monster
		this.setState({
			monster: { ...monster, skillsAthletics: this.stringToNumber(event.target.value) }
		})
	}

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
		return (
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
							<MonsterEnvironmentDropdown type={this.state.monster.environment} onChange={this.handleMonsterEnvironmentChange} />
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
								<TextField error = {false} id="armorClass" label="Armor Class" value={this.state.monster.armorClass} onChange={this.handleMonsterArmorClassChange} type="number" InputLabelProps={{ shrink: true }} required margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={6}>
							<div>Hit Points</div>
							<div className="form-group">
								<TextField error = {false} id="hitPoints" label="Hit Points" value={this.state.monster.hitPoints} onChange={this.handleMonsterArmorClassChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={6}>
							<div>Base Hit Point Dice</div>
							<div className="form-group">
								<TextField error={false} margin="dense" value={this.state.monster.hitPointDice} id="hitPointDice" label="Hit Point Dice" helperText="" fullWidth required onChange={this.handleMonsterHitPointDiceChange}/>
							</div>
						</Grid>
						<Grid item xs={6}>
							<div>Base Hit Point Modifier</div>
							<div className="form-group">
								<TextField error = {false} id="armorClass" label="Armor Class" value={this.state.monster.armorClass} onChange={this.handleMonsterArmorClassChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={6}>
							<div>Land Speed</div>
							<div className="form-group">
								<TextField error = {false} required id="armorClass" label="Armor Class" value={this.state.monster.armorClass} onChange={this.handleMonsterArmorClassChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={6}>
							<div>Swimming Speed</div>
							<div className="form-group">
								<TextField error = {false} id="armorClass" label="Armor Class" value={this.state.monster.armorClass} onChange={this.handleMonsterArmorClassChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div>Strength Stat</div>
							<div className="form-group">
								<TextField error = {false} required id="armorClass" label="Armor Class" value={this.state.monster.armorClass} onChange={this.handleMonsterArmorClassChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div>Dexterity Stat</div>
							<div className="form-group">
								<TextField error = {false} required id="armorClass" label="Armor Class" value={this.state.monster.armorClass} onChange={this.handleMonsterArmorClassChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div>Constitution Stat</div>
							<div className="form-group">
								<TextField error = {false} required id="armorClass" label="Armor Class" value={this.state.monster.armorClass} onChange={this.handleMonsterArmorClassChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div>Intelligence Stat</div>
							<div className="form-group">
								<TextField error = {false} required id="armorClass" label="Armor Class" value={this.state.monster.armorClass} onChange={this.handleMonsterArmorClassChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div>Wisdom Stat</div>
							<div className="form-group">
								<TextField error = {false} required id="armorClass" label="Armor Class" value={this.state.monster.armorClass} onChange={this.handleMonsterArmorClassChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div>Charisma Stat</div>
							<div className="form-group">
								<TextField error = {false} required id="armorClass" label="Armor Class" value={this.state.monster.armorClass} onChange={this.handleMonsterArmorClassChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
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
								<TextField error = {false} required id="challengeRating" label="Challenge Rating" value={this.state.monster.challengeRating} onChange={this.handleMonsterChallengeRatingChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
						<Grid item xs={6}>
							<div className="form-group">
								<TextField error = {false} required id="experiencePoints" label="Experience Points" value={this.state.monster.experiencePoints} onChange={this.handleMonsterExperiencePointsChange} type="number" InputLabelProps={{ shrink: true }} margin="normal"/>
							</div>
						</Grid>
					</Grid>
					<div className="form-group">
						<TextField autoFocus margin="dense" id="name" label="Email Address" helperText="Test" fullWidth required/>
					</div>
					<FormControl fullWidth>
						<InputLabel htmlFor="adornment-amount">Amount</InputLabel>
						<Input
							id="adornment-amount"
							endAdornment={<InputAdornment position="end">$</InputAdornment>}
						/>
					</FormControl>
					<TextField
						id="standard-number"
						label="Number"
						type="number"
						InputLabelProps={{
							shrink: true,
						}}
						margin="normal"
					/>
					<Button className="button" variant="contained" color="primary" type="submit"> Create Monster </Button>
				</form>
			</div>
		);
	}
}


/*
Form Notes:
Type: (Aberration, Beast, Celestial, Construct, Dragon, Elemental, Fey, Fiend, Giant, Humanoid, Monstrosity, Ooze, Plant, Undead)
Size: (Tiny, Small, Medium, Large, Huge, Gargantuan)
Alignment: (Freeform Text)
Environment: (Arctic, Coastal, Desert, Forest, Grassland, Hill, Mountain, Swamp, Underdark, Underwater, Urban)
Resistance: (Freeform Text)
Damage Immunity: (Freeform Text)
Condition Immunity: (Freeform Text)
Vulnerability: (Freeform Text)
Armor Class: 0+
Hit Points (Averaged Out): 0+
Hit Points (Die Roll): xdy + z
Speed (Land): 0+ ft
Speed (Swim): 0+ ft
Str Stat: 0+
Dex Stat: 0+
Con Stat: 0+
Int Stat:  0+
Wis Stat: 0+
Cha Stat:0+
Saving Throws — Str: int
Saving Throws — Dex: int
Saving Throws — Con: int
Saving Throws — Int: int
Saving Throws — Wis: int
Saving Throws — Cha: int
Skills:
— Strength (Athletics): int
— Dexterity (Acrobatics): int
— Dexterity (Sleight of Hands): int
— Dexterity (Stealth): int
— Intelligence (Arcana): int
— Intelligence (History): int
— Intelligence (Investigation): int
— Intelligence (Nature): int
— Intelligence (Religion): int
— Wisdom (Animal Handling): int
— Wisdom (Insight): int
— Wisdom (Medicine): int
— Wisdom (Perception): int
— Wisdom (Survival): int
— Charisma (Deception): int
— Charisma (Intimidation): int
— Charisma (Performance): int
— Charisma (Persuasion): int
Senses:
— Blindsight: 0+ft
— Darkvision: 0+ft
— Tremorsense: 0+ft
— Truesight: 0+ft
— Passive Wis (Perception):  int
— Passive Int (Investigation): int
— Passive Wis (Insight): int
Languages:
Challenge: 0.0+ (float)
XP: 0+
Abilities:
— Name: text
— Description: text
Actions:
— Name: text
— Description: text
— Usage Counters: 0+
— (Optional) Type of Attack: Melee / Ranged / N/A
— (Optional) To Hit: int
— (Optional) Reach: int ft
— (Optional) Target(s): 0+
— (Optional) Averaged Damage: 0+
— (Optional) xdy + z damage

*/