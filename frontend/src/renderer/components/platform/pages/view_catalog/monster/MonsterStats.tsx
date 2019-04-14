import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';

import { isDeepStrictEqual } from 'util';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, FormControl, InputLabel, Input, FormHelperText, Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//import { stateWithoutErrors } from '../../../../../../utils/StateSelection';

export interface IMonsterStatsProps {
	disabled?: boolean,
	// validation
	PayloadSchema: JoiObject,
	ValidationOptions: ValidationOptions,
	// parent
	Parent: string,
	// initial values
	initial: {
		Strength?: number;
		Dexterity?: number;
		Constitution?: number;
		Intelligence?: number;
		Wisdom?: number;
		Charisma?: number;
	}
}

export interface IMonsterStatsState {
	[key: string]: number | string | undefined;
	// data
	Strength?: number;
	Dexterity?: number;
	Constitution?: number;
	Intelligence?: number;
	Wisdom?: number;
	Charisma?: number;
	// errors
	StrengthError?: string;
	DexterityError?: string;
	ConstitutionError?: string;
	IntelligenceError?: string;
	WisdomError?: string;
	CharismaError?: string;
}

export class MonsterStats extends React.Component<IMonsterStatsProps, IMonsterStatsState> {
	constructor(props: IMonsterStatsProps) {
		super(props);
		this.state = {
			...props.initial
		};
	}

	componentWillReceiveProps(nextProps: IMonsterStatsProps) {
		if (isDeepStrictEqual(this.props.initial, nextProps.initial) == false)
			this.setState({
				...nextProps.initial
			});
	}

	private keyNames = [ "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma" ];

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	handleMonsterNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = this.stringToNumber(event.target.value);
		const name = event.currentTarget.name;
		Joi.validate(
			value,
			Joi.reach(this.props.PayloadSchema, [this.props.Parent, name]),
			this.props.ValidationOptions,
			(errors: ValidationError) => {
				this.setState({
					[name]: value,
					[name+'Error']: errors ? errors.details[0].message : undefined
				});
			});
		}

	render() {
		return (
			<ExpansionPanel defaultExpanded >
				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
					<Typography className='heading' >{this.props.Parent.replace(/([A-Z])/g, ' $1').trim()}</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Grid container spacing={8} >
						{this.keyNames.map(value =>
							<Grid item xs={12} key={this.props.Parent+value} >
								<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
									<InputLabel htmlFor={this.props.Parent+value}>{value}</InputLabel>
									<Input
										id={this.props.Parent+value}
										type='number'
										value={this.state[value] != undefined ? this.state[value] : ''}
										name={value}
										onChange={this.handleMonsterNumberChange}
										aria-describedby={value+'-helper-text'} />
									<FormHelperText error id={this.props.Parent+value+'-helper-text'}>{this.state[value+'Error']}</FormHelperText>
								</FormControl>
							</Grid>
						)}
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}