import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';

import { isDeepStrictEqual } from 'util';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, FormControl, InputLabel, Input, FormHelperText, Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Help} from "bloomer";

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

	private helperTextOptions:  {[id: string]: string;} = {
		'Blind': "Blind hint",
		'Blindsight': "Blindsight hint",
		'Darkvision': "Darkvision hint",
		'Tremorsense': "tremorsense hint",
		'Truesight': "Truesight hint",
		'Passive Perception': "passive perception hint",
		'Passive Investigation': "passive investigation hint",
		'Passive Insight': "passive insight hint",
	}

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
			<ExpansionPanel defaultExpanded CollapseProps={{timeout: 100}} >
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
									<Help>{this.helperTextOptions[senseName]}</Help>
								</FormControl>
							</Grid>
						)}
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}