import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';

import { isDeepStrictEqual } from 'util';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, FormControl, InputLabel, Input, FormHelperText, Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export interface IMonsterDefencesProps {
	disabled?: boolean,
	// validation
	PayloadSchema: JoiObject,
	ValidationOptions: ValidationOptions,
	// initial values
	initial: {
		ArmorClass?: number;
		HitPoints?: number;
		HitPointDistribution?: string;
	}
}

export interface IMonsterDefencesState {
	// data
	ArmorClass?: number;
	HitPoints?: number;
	HitPointDistribution?: string;
	// errors
	ArmorClassError?: string;
	HitPointsError?: string;
	HitPointDistributionError?: string;
}

export class MonsterDefences extends React.Component<IMonsterDefencesProps, IMonsterDefencesState> {
	constructor(props: IMonsterDefencesProps) {
		super(props);
		this.state = {
			...props.initial
		};
	}

	componentWillReceiveProps(nextProps: IMonsterDefencesProps) {
		if (isDeepStrictEqual(this.props.initial, nextProps.initial) == false)
			this.setState({
				...nextProps.initial
			});
	}

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = this.stringToNumber(event.target.value);
		const name = event.currentTarget.name;
		Joi.validate(
			value,
			Joi.reach(this.props.PayloadSchema, [name]),
			this.props.ValidationOptions,
			(errors: ValidationError) => {
				this.setState({
					[name]: value,
					[name+'Error']: errors ? errors.details[0].message : undefined
				});
			});
	}

	handleStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let value: string|undefined = event.target.value;
		if (/^\s*$/.test(value))
			value = undefined
		Joi.validate(
			value,
			Joi.reach(this.props.PayloadSchema, [event.currentTarget.name]),
			this.props.ValidationOptions,
			(errors: ValidationError) => {
				this.setState({
					[event.currentTarget.name]: value,
					[event.currentTarget.name+'Error']: errors ? errors.details[0].message : undefined
				});
			});
	}

	render() {
		return (
			<ExpansionPanel defaultExpanded CollapseProps={{timeout: 100}} >
				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
					<Typography className='heading' >Armor Class and Hit Points</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Grid container spacing={8} >
						<Grid item xs={12}>
							<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
								<InputLabel htmlFor="ArmorClass">Armor Class</InputLabel>
								<Input
									id='ArmorClass'
									type='number'
									value={this.state.ArmorClass != undefined ? this.state.ArmorClass : ''}
									name='ArmorClass'
									onChange={this.handleNumberChange}
									aria-describedby="ArmorClass-helper-text" />
								<FormHelperText error id="ArmorClass-helper-text">{this.state.ArmorClassError}</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item xs={6}>
							<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
								<InputLabel htmlFor="HitPoints">Hit Points</InputLabel>
								<Input
									id='HitPoints'
									type='number'
									value={this.state.HitPoints != undefined ? this.state.HitPoints : ''}
									name='HitPoints'
									onChange={this.handleNumberChange}
									aria-describedby="HitPoints-helper-text" />
								<FormHelperText error id="HitPoints-helper-text">{this.state.HitPointsError}</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item xs={6}>
							<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
								<InputLabel htmlFor="HitPointDistribution">Hit Point Distribution</InputLabel>
								<Input
									id='HitPointDistribution'
									type='text'
									value={this.state.HitPointDistribution || ''}
									name='HitPointDistribution'
									onChange={this.handleStringChange}
									aria-describedby="HitPointDistribution-helper-text" />
								<FormHelperText error id="HitPointDistribution-helper-text">{this.state.HitPointDistributionError}</FormHelperText>
							</FormControl>
						</Grid>
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}