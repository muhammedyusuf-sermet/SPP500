import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';
import '../../../../../css/app.css';

import { isDeepStrictEqual } from 'util';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, FormControl, InputLabel, Input, FormHelperText, Grid, Tooltip } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Help } from "bloomer";

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
		if (isDeepStrictEqual(this.props.initial, nextProps.initial) == false) {
			this.setState({
				...nextProps.initial
			});
		} else if (this.props.disabled != nextProps.disabled) {
			this.forceUpdate();
		}
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
								<Tooltip disableFocusListener title={"Your Armor Class (AC) represents how hard it is for opponents to land a solid, damaging blow on you. It’s the attack roll result that an opponent needs to achieve to hit you. Your AC is equal to the following: 10 + armor bonus + shield bonus + Dexterity modifier + size modifier"}>
										<Help className="tooltip">Hover for More About Armor Class</Help>
								</Tooltip>
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
								<Tooltip disableFocusListener title={"Hit points represent a combination of physical and mental durability, the will to live, and luck. Creatures with more hit points are more difficult to kill. Those with fewer hit points are more fragile. A creature's current hit points (usually just called hit points) can be any number from the creature's hit point maximum down to 0. This number changes frequently as a creature takes damage or receives healing."}>
										<Help className="tooltip">Hover for More About Hit Points</Help>
								</Tooltip>
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
								<Tooltip disableFocusListener title={"For randomized and dynamic encounters, you may choose to define the hit points of a monster by a hit point distribution. This value is how you calculate the monsters hit points at the start of the encounter. It is provided in # of dice * # of sides of dice + modifier in the normal #d#+# format."}>
										<Help className="tooltip">Hover for More About Hit Point Distribution</Help>
								</Tooltip>
							</FormControl>
						</Grid>
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}