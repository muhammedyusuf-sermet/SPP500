import * as React from 'react';
//TODO use validation to ensure the speeds make sense
//const Joi = require('joi');
//import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';

import { isDeepStrictEqual } from 'util';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, FormControl, InputLabel, Input, FormHelperText, Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Help} from "bloomer";

export interface IMonsterSpeedBonusesProps {
	disabled?: boolean;
	// validation TODO not done yet
	//PayloadSchema: JoiObject;
	//ValidationOptions: ValidationOptions;
	// initial values
	initial: {
		[SpeedName: string]: number | undefined;
	}
}

export interface IMonsterSpeedBonusesState {
	[key: string]: number | string | undefined;
}

export class MonsterSpeedBonuses extends React.Component<IMonsterSpeedBonusesProps, IMonsterSpeedBonusesState> {
	constructor(props: IMonsterSpeedBonusesProps) {
		super(props);
		this.state = {
			...props.initial
		};
	}

	componentWillReceiveProps(nextProps: IMonsterSpeedBonusesProps) {
		if (isDeepStrictEqual(this.props.initial, nextProps.initial) == false) {
			this.setState({
				...nextProps.initial
			});
		} else if (this.props.disabled != nextProps.disabled) {
			this.forceUpdate();
		}
	}

	//TODO: Make speed its own dictionary of all the different monvement options.
	private keyNames: string[] = ["SpeedLand", "SpeedSwim"];

	private helperText: {[id: string]: string;} = {
		"SpeedLand": "The distance in feet that the monster can walk in 1 round.",
		"SpeedSwim": "The distance in feet that the monster can swim in 1 round.",
	}

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	handleMonsterSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = this.stringToNumber(event.target.value);
		const name = event.currentTarget.name;
		this.setState({
			[name]: value
		});
		/*TODO: Add validation and help messages
		Joi.validate(
			{ [name]: value },
			Joi.reach(this.props.PayloadSchema, ['Speeds']),
			this.props.ValidationOptions,
			(errors: ValidationError) => {
				this.setState({
					[name]: value,
					[name+'Error']: errors ? errors.details[0].message : undefined
				});
			});*/
	}

	render() {
		return (
			<ExpansionPanel defaultExpanded CollapseProps={{timeout: 100}} >
				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
					<Typography className='heading' >Speed Bonuses</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Grid container spacing={8} >
						{this.keyNames.map(speedName =>
							<Grid item xs={6} key={speedName} >
								<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
									<InputLabel htmlFor={speedName}>{speedName.replace(/([A-Z])/g, ' $1').trim()}</InputLabel>
									<Input
										id={speedName}
										type='number'
										value={this.state[speedName] != undefined ? this.state[speedName] : ''}
										name={speedName}
										onChange={this.handleMonsterSpeedChange}
										aria-describedby={speedName+'-helper-text'} />
									<FormHelperText error id={speedName+'-helper-text'}>{this.state[speedName+'Error']}</FormHelperText>
									<Help>{this.helperText[speedName]}</Help>
								</FormControl>
							</Grid>
						)}
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
			/*<Tile className="box" isVertical>
				<Subtitle>Movement Speed</Subtitle>
				<Field isGrouped='centered' isHorizontal>
					<Control isExpanded>
						<Label>Land Speed</Label>
						<Input
							disabled={this.props.disabled}
							id='SpeedLand'
							type='number'
							placeholder='Land Speed'
							autoComplete='SpeedLand'
							value={this.state.SpeedLand != undefined ? this.state.SpeedLand : ''}
							name='SpeedLand'
							onChange={this.handleMonsterSpeedChange} />
					</Control>
					<Control isExpanded>
						<Label>Swimming Speed</Label>
						<Input
							disabled={this.props.disabled}
							id='SpeedSwim'
							type='number'
							placeholder='Swimming Speed'
							autoComplete='SpeedSwim'
							value={this.state.SpeedSwim != undefined ? this.state.SpeedSwim : ''}
							name='SpeedSwim'
							onChange={this.handleMonsterSpeedChange} />
					</Control>
				</Field>
			</Tile>*/
		);
	}
}