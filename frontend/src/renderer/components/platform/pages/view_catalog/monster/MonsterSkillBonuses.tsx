import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';

import { isDeepStrictEqual } from 'util';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, FormControl, InputLabel, Input, FormHelperText, Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
			<ExpansionPanel defaultExpanded >
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
								</FormControl>
							</Grid>
						)}
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}