import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';

import { isDeepStrictEqual } from 'util';
import { FormControl, InputLabel, Input, FormHelperText, Grid } from '@material-ui/core';

import { EnumDropdown } from '../../../../helpers/EnumDropdown';
import { stateWithoutErrors } from '../../../../../../utils/StateSelection';
import { ICharacterData, CharacterRace, CharacterClass } from '../../../../../../character';
import { ICampaignData } from '../../../../../../campaign';

const races = Object.values(CharacterRace);
const classes = Object.values(CharacterClass);

export interface IEncounterState {
	Id?: number
}

export interface ICharacterDetailsProps {
	disabled?: boolean,
	// validation
	PayloadSchema: JoiObject,
	ValidationOptions: ValidationOptions,
	// initial values
	Character: ICharacterData
}

export interface ICharacterDetailsState {
	// data
	Name?: string;
	Level?: number;
	Race?: CharacterRace;
	Class?: CharacterClass;
	MaxHealth?: number;
	ArmorClass?: number;
	Notes?: string;
	Campaigns?: ICampaignData[];
	// errors
	NameError?: string;
	LevelError?: string;
	RaceError?: string;
	ClassError?: string;
	MaxHealthError?: string;
	ArmorClassError?: string;
	NotesError?: string;
	CampaignsError?: string;
}

export class CharacterDetails extends React.Component<ICharacterDetailsProps, ICharacterDetailsState> {
	constructor(props: ICharacterDetailsProps) {
		super(props);
		this.state = {
			...props.Character,
		};
	}

	componentWillReceiveProps(nextProps: ICharacterDetailsProps) {
		if (isDeepStrictEqual(this.props.Character, nextProps.Character) == false) {
			this.setState({
				...nextProps.Character,
			});
		} else if (this.props.disabled != nextProps.disabled) {
			this.forceUpdate();
		}
	}

	handleStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = /^\s*$/.test(event.target.value) ? undefined : event.target.value;
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

	handleCharacterEnumChange = (name: string, newEnum?: string) => {
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

	public GetData = (): ICharacterData => {
		return stateWithoutErrors(this.state);
	}

	render() {
		return (
			<Grid container spacing={8} >
				<Grid item xs={12} >
					<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
						<InputLabel htmlFor="Name">Name</InputLabel>
						<Input
							id='Name'
							type='text'
							value={this.state.Name || ''}
							name='Name'
							onChange={this.handleStringChange}
							aria-describedby="Name-helper-text" />
						<FormHelperText error id="Name-helper-text">{this.state.NameError}</FormHelperText>
					</FormControl>
				</Grid>
				<Grid item xs={6} >
					<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
						<InputLabel htmlFor='Race' >Race</InputLabel>
						<EnumDropdown
							disabled={this.props.disabled}
							selected={this.state.Race}
							name='Race'
							options={races}
							onChange={this.handleCharacterEnumChange} />
						<FormHelperText error id='Race-helper-text' >{this.state.RaceError}</FormHelperText>
					</FormControl>
				</Grid>
				<Grid item xs={6} >
					<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
						<InputLabel htmlFor='Class' >Class</InputLabel>
						<EnumDropdown
							disabled={this.props.disabled}
							selected={this.state.Class}
							name='Class'
							options={classes}
							onChange={this.handleCharacterEnumChange} />
						<FormHelperText error id='Class-helper-text' >{this.state.ClassError}</FormHelperText>
					</FormControl>
				</Grid>
				<Grid item xs={12} >
					<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
						<InputLabel htmlFor="Level">Level</InputLabel>
						<Input
							id='Level'
							type='number'
							value={this.state.Level != undefined ? this.state.Level : ''}
							name='Level'
							onChange={this.handleNumberChange}
							aria-describedby="Level-helper-text" />
						<FormHelperText error id="Level-helper-text">{this.state.LevelError}</FormHelperText>
					</FormControl>
				</Grid>
				<Grid item xs={6}>
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
						<InputLabel htmlFor="MaxHealth">Max Hit Points</InputLabel>
						<Input
							id='MaxHealth'
							type='number'
							value={this.state.MaxHealth != undefined ? this.state.MaxHealth : ''}
							name='MaxHealth'
							onChange={this.handleNumberChange}
							aria-describedby="MaxHealth-helper-text" />
						<FormHelperText error id="MaxHealth-helper-text">{this.state.MaxHealthError}</FormHelperText>
					</FormControl>
				</Grid>
				<Grid item xs={12} >
					<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
						<InputLabel htmlFor="Notes">Notes</InputLabel>
						<Input
							id='Notes'
							type='text'
							multiline
							rows={10}
							rowsMax={10}
							value={this.state.Notes || ''}
							name='Notes'
							onChange={this.handleStringChange}
							aria-describedby="Notes-helper-text" />
						<FormHelperText error id="Notes-helper-text">{this.state.NotesError}</FormHelperText>
					</FormControl>
				</Grid>
			</Grid>
		);
	}
}