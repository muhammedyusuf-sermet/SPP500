import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';
import '../../../../../css/app.css';

import { MonsterType, MonsterRace, Size, Environment, Alignment } from '../../../../../../monster';
import { isDeepStrictEqual } from 'util';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, FormControl, InputLabel, Input, FormHelperText, Grid, Select, Tooltip } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Help} from "bloomer";

const types = Object.values(MonsterType);
const sizes = Object.values(Size);
const races = Object.values(MonsterRace);
const environments = Object.values(Environment);
const alignments = Object.values(Alignment);

export interface IMonsterDropdownProps {
	disabled?: boolean,
	name: string,
	selected?: string,
	options: string[]
	onChange: (name: string, selectOption?: string) => void
}

export interface IMonsterDropdownState {
	selected: string
}

export class MonsterDropdown extends React.Component<IMonsterDropdownProps, IMonsterDropdownState> {
	constructor(props: IMonsterDropdownProps) {
		super(props);
		this.state = {
			selected: props.selected ? props.selected : 'Default'
		};
	}

	componentWillReceiveProps(nextProps: IMonsterDropdownProps) {
		if (this.state.selected != nextProps.selected)
			this.setState({
				selected: nextProps.selected ? nextProps.selected : 'Default'
			});
	}

	handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		this.setState({selected: event.target.value});
		this.props.onChange(this.props.name, event.target.value);
	}

	render() {
		return (
			<Select
				native={true}
				id={this.props.name}
				disabled={this.props.disabled}
				onChange={this.handleChange}
				value={this.state.selected}
				input={<Input name={this.props.name} id={this.props.name} />} >
				<option
					id={this.props.name+'.'+'Default'}
					value='' >
					Default
				</option>
				{this.props.options.map(option =>
					<option
						key={this.props.name+'.'+option}
						id={this.props.name+'.'+option}
						value={option}>
						{option.replace(/([A-Z])/g, ' $1').trim()}
					</option>
				)}
			</Select>
		);
	}
}

export interface IMonsterEnumConfigurationProps {
	disabled?: boolean,
	// validation
	PayloadSchema: JoiObject,
	ValidationOptions: ValidationOptions,
	// initial values
	initial: {
		Size?: string;
		Type?: string;
		Race?: string;
		Alignment?: string;
		Environment?: string;
	}
}

export interface IMonsterEnumConfigurationState {
	// data
	Size?: string;
	Type?: string;
	Race?: string;
	Alignment?: string;
	Environment?: string;
	// errors
	SizeError?: string;
	TypeError?: string;
	RaceError?: string;
	AlignmentError?: string;
	EnvironmentError?: string;
}

export class MonsterEnumConfiguration extends React.Component<IMonsterEnumConfigurationProps, IMonsterEnumConfigurationState> {
	constructor(props: IMonsterEnumConfigurationProps) {
		super(props);
		this.state = {
			...props.initial
		};
	}

	componentWillReceiveProps(nextProps: IMonsterEnumConfigurationProps) {
		if (isDeepStrictEqual(this.props.initial, nextProps.initial) == false)
			this.setState({
				...nextProps.initial
			});
	}

	handleMonsterEnumChange = (name: string, newEnum?: string) => {
		if (newEnum) {
			Joi.validate(
				newEnum,
				Joi.reach(this.props.PayloadSchema, [name]),
				this.props.ValidationOptions,
				(errors: ValidationError) => {
					if(errors) {
						this.setState({
							[name+'Error']: errors.details[0].message
						});
					} else {
						this.setState({
							[name]: newEnum,
							[name+'Error']: undefined
						});
					}
				});
		} else {
			this.setState({
				[name]: undefined,
				[name+'Error']: undefined
			});
		}
	}

	render() {
		return (
			<ExpansionPanel defaultExpanded CollapseProps={{timeout: 100}} >
				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
					<Typography className='heading' >Basic Configurations</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Grid container spacing={8} >
						<Grid item xs={4} >
							<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
								<InputLabel htmlFor='Type' >Type</InputLabel>
								<MonsterDropdown
									disabled={this.props.disabled}
									selected={this.state.Type}
									name='Type'
									options={types}
									onChange={this.handleMonsterEnumChange} />
								<FormHelperText error id='Type-helper-text' >{this.state.TypeError}</FormHelperText>
								<Tooltip disableFocusListener title={"Creature types are rough categories of creatures which determine the way game mechanics affect the creature. The choice of type is important, as all creatures which have a given type will share certain characteristics (with some exceptions)."}>
										<Help className="tooltip">Hover for More About Monster Type</Help>
								</Tooltip>
							</FormControl>
						</Grid>
						<Grid item xs={4} >
							<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
								<InputLabel htmlFor='Size' >Size</InputLabel>
								<MonsterDropdown
									disabled={this.props.disabled}
									selected={this.state.Size}
									name='Size'
									options={sizes}
									onChange={this.handleMonsterEnumChange} />
								<FormHelperText error id='Size-helper-text' >{this.state.SizeError}</FormHelperText>
								<Tooltip disableFocusListener title={"A creature's size determines how much space it occupies on squares or hexes, as shown in the Creature Size and Space table. If the miniature you use for a monster takes up an amount of space different from what's on the table, that's fine, but treat the monster as its official size for all other rules."}>
										<Help className="tooltip">Hover for More About Monster Size</Help>
								</Tooltip>
							</FormControl>
						</Grid>
						<Grid item xs={4} >
							<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
								<InputLabel htmlFor='Race' >Race</InputLabel>
								<MonsterDropdown
									disabled={this.props.disabled}
									selected={this.state.Race}
									name='Race'
									options={races}
									onChange={this.handleMonsterEnumChange} />
								<FormHelperText error id='Race-helper-text' >{this.state.RaceError}</FormHelperText>
								<Tooltip disableFocusListener title={"A character race is a fundamental part of the identity and nature of characters in the Dungeons & Dragons role-playing game. Each race has a distinct appearance, behavior and often range of statistics associated with it. See your DM handbook for more information."}>
										<Help className="tooltip">Hover for More About Monster Race</Help>
								</Tooltip>
							</FormControl>
						</Grid>
						<Grid item xs={6} >
							<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
								<InputLabel htmlFor='Alignment' >Alignment</InputLabel>
								<MonsterDropdown
									disabled={this.props.disabled}
									selected={this.state.Alignment}
									name='Alignment'
									options={alignments}
									onChange={this.handleMonsterEnumChange} />
								<FormHelperText error id='Alignment-helper-text' >{this.state.AlignmentError}</FormHelperText>
								<Tooltip disableFocusListener title={"Alignment is a categorization of the ethical and moral perspective of player characters, non-player characters, and creatures. Most versions of the game feature a system in which players make two choices for characters. One is the character's views on 'law' vs 'chaos', the other on 'good' vs 'evil'."}>
										<Help className="tooltip">Hover for More About Monster Alignment</Help>
								</Tooltip>
							</FormControl>
						</Grid>
						<Grid item xs={6} >
							<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
								<InputLabel htmlFor='Environment' >Environment</InputLabel>
								<MonsterDropdown
									disabled={this.props.disabled}
									selected={this.state.Environment}
									name='Environment'
									options={environments}
									onChange={this.handleMonsterEnumChange} />
								<FormHelperText error id='Environment-helper-text' >{this.state.EnvironmentError}</FormHelperText>
								<Tooltip disableFocusListener title={"Monster environment is the type of environment that the monster is most likely to be found in."}>
										<Help className="tooltip">Hover for More About Monster Environment</Help>
								</Tooltip>
							</FormControl>
						</Grid>
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}