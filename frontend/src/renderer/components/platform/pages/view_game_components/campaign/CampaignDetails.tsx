import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';

import { isDeepStrictEqual } from 'util';
import { FormControl, InputLabel, Input, FormHelperText, Grid } from '@material-ui/core';
import { stateWithoutErrors } from '../../../../../../utils/StateSelection';
import { ICampaignData } from '../../../../../../campaign';
import { IEncounterData } from '../../../../../../encounter';

export interface ICampaignDetailsProps {
	disabled?: boolean,
	// validation
	PayloadSchema: JoiObject,
	ValidationOptions: ValidationOptions,
	// initial values
	initial: {
		Name?: string;
		Summary?: string;
		Notes?: string;
		Encounters?: IEncounterData[];
	}
}

export interface ICampaignDetailsState {
	// data
	Name?: string;
	Summary?: string;
	Notes?: string;
	Encounters?: string;
	// errors
	NameError?: string;
	SummaryError?: string;
	NotesError?: string;
	EncountersError?: string;
}

export class CampaignDetails extends React.Component<ICampaignDetailsProps, ICampaignDetailsState> {
	constructor(props: ICampaignDetailsProps) {
		super(props);
		this.state = {
			...props.initial,
			Encounters: props.initial.Encounters ? props.initial.Encounters.map((value)=>(value.Id)).join(',') : ''
		};
	}

	componentWillReceiveProps(nextProps: ICampaignDetailsProps) {
		if (isDeepStrictEqual(this.props.initial, nextProps.initial) == false)
			this.setState({
				...nextProps.initial,
				Encounters: nextProps.initial.Encounters ? nextProps.initial.Encounters.map((value)=>(value.Id)).join(',') : ''
			});
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

	handleCampaignEncounterIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			Encounters: event.target.value
		})
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
				<Grid item xs={12} >
					<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
						<InputLabel htmlFor="Summary">Summary</InputLabel>
						<Input
							id='Summary'
							type='text'
							multiline
							rows={10}
							rowsMax={10}
							value={this.state.Summary || ''}
							name='Summary'
							onChange={this.handleStringChange}
							aria-describedby="Summary-helper-text" />
						<FormHelperText error id="Summary-helper-text">{this.state.SummaryError}</FormHelperText>
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
				<Grid item xs={12} >
					<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
						<InputLabel htmlFor="Encounters">Encounter Id's</InputLabel>
						<Input
							id='Encounters'
							type='text'
							multiline
							rows={10}
							rowsMax={10}
							value={this.state.Encounters || ''}
							name='Encounters'
							onChange={this.handleCampaignEncounterIdChange}
							aria-describedby="Encounters-helper-text" />
						<FormHelperText error id="Encounters-helper-text">{this.state.EncountersError}</FormHelperText>
					</FormControl>
				</Grid>
			</Grid>
		);
	}
}