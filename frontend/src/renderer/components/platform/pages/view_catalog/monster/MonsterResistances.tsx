import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';
import '../../../../../css/app';

import { isDeepStrictEqual } from 'util';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, FormControl, InputLabel, Input, FormHelperText, Grid, Tooltip } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Help} from "bloomer";

export interface IMonsterResistancesProps {
	disabled?: boolean,
	// validation
	PayloadSchema: JoiObject,
	ValidationOptions: ValidationOptions,
	// initial values
	initial: {
		DamageVulnerabilities?: string;
		DamageResistances?: string;
		DamageImmunities?: string;
		ConditionImmunities?: string;
	}
}

export interface IMonsterResistancesState {
	// data
	DamageVulnerabilities?: string;
	DamageResistances?: string;
	DamageImmunities?: string;
	ConditionImmunities?: string;
	// errors
	DamageVulnerabilitiesError?: string;
	DamageResistancesError?: string;
	DamageImmunitiesError?: string;
	ConditionImmunitiesError?: string;
}

export class MonsterResistances extends React.Component<IMonsterResistancesProps, IMonsterResistancesState> {
	constructor(props: IMonsterResistancesProps) {
		super(props);
		this.state = {
			...props.initial
		};
	}

	componentWillReceiveProps(nextProps: IMonsterResistancesProps) {
		if (isDeepStrictEqual(this.props.initial, nextProps.initial) == false)
			this.setState({
				...nextProps.initial
			});
	}

	handleResistancesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
					<Typography className='heading' >Vulnerability, Resistance, and Immunity</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Grid container spacing={8} >
						<Grid item xs={12}>
							<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
								<InputLabel htmlFor="DamageVulnerabilities">Damage Vulnerabilities</InputLabel>
								<Input
									id='DamageVulnerabilities'
									type='text'
									value={this.state.DamageVulnerabilities || ''}
									name='DamageVulnerabilities'
									onChange={this.handleResistancesChange}
									aria-describedby="DamageVulnerabilities-helper-text" />
								<FormHelperText error id="DamageVulnerabilities-helper-text">{this.state.DamageVulnerabilitiesError}</FormHelperText>
								<Tooltip disableFocusListener title={"If a creature or an object has vulnerability to a damage type, damage of that type is doubled against it."}>
										<Help className="tooltip">Hover for More About Damage Vulnerabilities</Help>
								</Tooltip>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
								<InputLabel htmlFor="DamageResistances">Damage Resistances</InputLabel>
								<Input
									id='DamageResistances'
									type='text'
									value={this.state.DamageResistances || ''}
									name='DamageResistances'
									onChange={this.handleResistancesChange}
									aria-describedby="DamageResistances-helper-text" />
								<FormHelperText error id="DamageResistances-helper-text">{this.state.DamageResistancesError}</FormHelperText>
								<Tooltip disableFocusListener title={"If a creature or an object has resistance to a damage type, damage of that type is halved against it."}>
										<Help className="tooltip">Hover for More About Damage Resistance</Help>
								</Tooltip>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
								<InputLabel htmlFor="DamageImmunities">Damage Immunities</InputLabel>
								<Input
									id='DamageImmunities'
									type='text'
									value={this.state.DamageImmunities || ''}
									name='DamageImmunities'
									onChange={this.handleResistancesChange}
									aria-describedby="DamageImmunities-helper-text" />
								<FormHelperText error id="DamageImmunities-helper-text">{this.state.DamageImmunitiesError}</FormHelperText>
								<Tooltip disableFocusListener title={"Creatures can be immune to damage types. A creature immune to a damage type doesn't take damage from that type of damage."}>
										<Help className="tooltip">Hover for More About Damage Immunities</Help>
								</Tooltip>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
								<InputLabel htmlFor="ConditionImmunities">Condition Immunities</InputLabel>
								<Input
									id='ConditionImmunities'
									type='text'
									value={this.state.ConditionImmunities || ''}
									name='ConditionImmunities'
									onChange={this.handleResistancesChange}
									aria-describedby="ConditionImmunities-helper-text" />
								<FormHelperText error id="ConditionImmunities-helper-text">{this.state.ConditionImmunitiesError}</FormHelperText>
								<Tooltip disableFocusListener title={"Creatures can be immune to conditions. If a creature is immune to fear, poison or illusion, it isn't affected by the non-damaging effects of power with those keywords. If a creature is immune to a condition, it cannot become afflicted by that condition."}>
										<Help className="tooltip">Hover for More About Condition Immunity</Help>
								</Tooltip>
							</FormControl>
						</Grid>
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}