import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';

import { isDeepStrictEqual } from 'util';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, FormControl, InputLabel, Input, FormHelperText, Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export interface IMonsterSenseBonusesProps {
	disabled?: boolean;
	// validation
	PayloadSchema: JoiObject;
	ValidationOptions: ValidationOptions;
	// initial values
	initial: {
		[senseName: string]: number | undefined;
	}
}

export interface IMonsterSenseBonusesState {
	[key: string]: number | string | undefined;
}

export class MonsterSenseBonuses extends React.Component<IMonsterSenseBonusesProps, IMonsterSenseBonusesState> {
	constructor(props: IMonsterSenseBonusesProps) {
		super(props);
		this.state = {
			...props.initial
		};
	}

	componentWillReceiveProps(nextProps: IMonsterSenseBonusesProps) {
		if (isDeepStrictEqual(this.props.initial, nextProps.initial) == false)
			this.setState({
				...nextProps.initial
			});
	}

	private keyNames: string[] = [
		'Blind', 'Blindsight', 'Darkvision', 'Tremorsense', 'Truesight',
		'Passive Perception', 'Passive Investigation', 'Passive Insight' ];

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	handleMonsterSenseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = this.stringToNumber(event.target.value);
		const name = event.currentTarget.name;
		Joi.validate(
			{ [name]: value },
			Joi.reach(this.props.PayloadSchema, ['Senses']),
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
					<Typography className='heading' >Sense Bonuses</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Grid container spacing={8} >
						{this.keyNames.map(senseName =>
							<Grid item xs={6} sm={4} key={senseName} >
								<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
									<InputLabel htmlFor={senseName}>{senseName}</InputLabel>
									<Input
										id={senseName}
										type='number'
										value={this.state[senseName] != undefined ? this.state[senseName] : ''}
										name={senseName}
										onChange={this.handleMonsterSenseChange}
										aria-describedby={senseName+'-helper-text'} />
									<FormHelperText error id={senseName+'-helper-text'}>{this.state[senseName+'Error']}</FormHelperText>
								</FormControl>
							</Grid>
						)}
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}