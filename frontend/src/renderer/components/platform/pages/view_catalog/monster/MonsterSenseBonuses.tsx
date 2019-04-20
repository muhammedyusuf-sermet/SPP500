import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';
import '../../../../../css/app.css';

import { isDeepStrictEqual } from 'util';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, FormControl, InputLabel, Input, FormHelperText, Grid, Tooltip } from '@material-ui/core';
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
		'Blind': "A creature with (Blind) can only see through blindsight, darkvision, or truesight senses. Set this value to above 0 to enable the Blind trait.",
		'Blindsight': "Using nonvisual senses, such as sensitivity to vibrations, keen smell, acute hearing, or echolocation, a creature with blindsight maneuvers and fights as well as a sighted creature. Invisibility, darkness, and most kinds of concealment are irrelevant, though the creature must have line of effect to a creature or object to discern that creature or object.",
		'Darkvision': "A monster with Darkvision can see in the dark within a specific radius. The monster can see in dim light within the radius as if it were bright light, and in Darkness as if it were dim light. The monster can’t discern color in Darkness, only shades of gray.",
		'Tremorsense': "A monster with tremorsense can detect and pinpoint the Origin of vibrations within a specific radius, provided that the monster and the source of the vibrations are in contact with the same ground or substance. Tremorsense can’t be used to detect flying or incorporeal creatures.",
		'Truesight': "A creature with truesight can, out to a specific range, see in normal and magical darkness, see invisible creatures and objects, automatically detect visual illusions and succeed on saving throws against them, and perceives the original form of a shapechanger or a creature that is transformed by magic. Furthermore, the creature can see into the Ethereal Plane.",
		'Passive Perception': "This stat helps to handle whether monsters who are not actively searching for something will notice a hidden object or creature.",
		'Passive Investigation': "This stat helps to handle whether monsters who are not actively trying to investigate something will notice a clue or fact about that thing.",
		'Passive Insight': "This stat helps to handle whether monsters who are not actively trying to detect deception will notice when someone is lying to or witholding truth from them.",
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
									<Tooltip disableFocusListener title={this.helperTextOptions[senseName]}>
										<Help className="tooltip">Hover for More About {senseName}</Help>
									</Tooltip>
								</FormControl>
							</Grid>
						)}
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}