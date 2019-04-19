import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';

import { isDeepStrictEqual } from 'util';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, FormControl, InputLabel, Input, FormHelperText, Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Help} from "bloomer";

export interface IMonsterSkillBonusesProps {
	disabled?: boolean;
	// validation
	PayloadSchema: JoiObject;
	ValidationOptions: ValidationOptions;
	// initial values
	initial: {
		[skillName: string]: number | undefined;
	}
}

export interface IMonsterSkillBonusesState {
	[key: string]: number | string | undefined;
}

export class MonsterSkillBonuses extends React.Component<IMonsterSkillBonusesProps, IMonsterSkillBonusesState> {
	constructor(props: IMonsterSkillBonusesProps) {
		super(props);
		this.state = {
			...props.initial
		};
	}

	componentWillReceiveProps(nextProps: IMonsterSkillBonusesProps) {
		if (isDeepStrictEqual(this.props.initial, nextProps.initial) == false)
			this.setState({
				...nextProps.initial
			});
	}

	private keyNames: string[] = [
		'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight',
		'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance',
		'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival' ];

	private skillBonusesHints: {[id: string]: string;} = {
		'Acrobatics': " Dexterity (Acrobatics) covers your attempt to stay on your feet in a tricky situation, such as when you're trying to run across a sheet of ice, balance on a tightrope, or stay upright on a rocking ship's deck. It can also count to see if you can perform acrobatic stunts, including dives, rolls, somersaults, and flips.",
		'Animal Handling': "animal handling hint",
		'Arcana': "arcana hint",
		'Athletics': "Strength (Athletics) covers difficult situations you encounter while climbing, jumping, or swimming.",
		'Deception': "deception hint",
		'History': "history hint",
		'Insight': "insight hint",
		'Intimidation': "intimidation hint",
		'Investigation': "investigation hint",
		'Medicine': "medicine hint",
		'Nature': "nature hint",
		'Perception': "Wisdom (Perception) lets you spot, hear, or otherwise detect the presence of something.",
		'Performance': "performance hint",
		'Persuasion': "persuassion hint",
		'Religion': "religion hint",
		'Sleight of Hand': "Dexterity (Sleight of Hand) covers when you attempt an act of legerdemain or manual trickery, such as planting something on someone else, concealing an object on your person, or slipping something out of another person's pocket.",
		'Stealth': "stealth hint",
		'Survival': "survival hint",
	}

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	handleMonsterSkillChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = this.stringToNumber(event.target.value);
		const name = event.currentTarget.name;
		Joi.validate(
			{ [name]: value },
			Joi.reach(this.props.PayloadSchema, ['Skills']),
			this.props.ValidationOptions,
			(errors: ValidationError) => {
				this.setState({
					[name]: value,
					[name+'Error']: errors ? errors.details[0].message : undefined
				});
			});
		};

	render() {
		return (
			<ExpansionPanel defaultExpanded CollapseProps={{timeout: 100}} >
				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
					<Typography className='heading' >Skill Bonuses</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Grid container spacing={8} >
						{this.keyNames.map(skillName =>
							<Grid item xs={6} sm={4} key={skillName} >
								<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
									<InputLabel htmlFor={skillName}>{skillName}</InputLabel>
									<Input
										id={skillName}
										type='number'
										value={this.state[skillName] != undefined ? this.state[skillName] : ''}
										name={skillName}
										onChange={this.handleMonsterSkillChange}
										aria-describedby={skillName+'-helper-text'} />
									<FormHelperText error id={skillName+'-helper-text'}>{this.state[skillName+'Error']}</FormHelperText>
									<Help>{this.skillBonusesHints[skillName]}</Help>
								</FormControl>
							</Grid>
						)}
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}