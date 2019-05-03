import * as React from 'react';
var request = require('request-promise-native');

const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';

import { isDeepStrictEqual } from 'util';
import { FormControl, InputLabel, Input, FormHelperText, Grid, TableHead, TableCell, TableBody, TableRow, Table, Checkbox, Paper, TablePagination } from '@material-ui/core';
import { IEncounterData } from '../../../../../../encounter';
import { ICharacterData } from '../../../../../../character';
import { ICampaignData } from '../../../../../../campaign';
import { API_URL } from '../../../../../../config';
import { CookieManager } from '../../../../../../cookie';

interface IEncounterGetResponse {
	status: number,
	messages: string[],
	content: IEncounterData[],
	total: number,
}

interface ICharacterGetResponse {
	status: number,
	messages: string[],
	content: ICharacterData[],
	total: number,
}

export interface ICampaignDetailsProps {
	disabled?: boolean,
	// validation
	PayloadSchema: JoiObject,
	ValidationOptions: ValidationOptions,
	// initial values
	Campaign: ICampaignData
}

export interface ICampaignDetailsState {
	// data
	Name: string;
	Summary?: string;
	Notes?: string;
	EncountersSet: Set<number | undefined>;
	CharactersSet: Set<number | undefined>;
	// errors
	NameError?: string;
	SummaryError?: string;
	NotesError?: string;
	EncountersSetError?: string;
	CharactersSetError?: string;
	// tables
	encounterPage: number;
	encounterPageSize: number,
	encounterTotal: number,
	encountersInCurrentPage: IEncounterData[],
	characterPage: number;
	characterPageSize: number,
	characterTotal: number,
	charactersInCurrentPage: ICharacterData[],
}

export class CampaignDetails extends React.Component<ICampaignDetailsProps, ICampaignDetailsState> {
	constructor(props: ICampaignDetailsProps) {
		super(props);
		let encounterSet = new Set<number | undefined>();
		let characterSet = new Set<number | undefined>();
		if (props.Campaign.Encounters)
			encounterSet = new Set(props.Campaign.Encounters.map(enc => enc.Id))
		if (props.Campaign.Characters)
			characterSet = new Set(props.Campaign.Characters.map(enc => enc.Id))
		this.state = {
			Name: props.Campaign.Name,
			Summary: props.Campaign.Summary,
			Notes: props.Campaign.Notes,
			EncountersSet: encounterSet,
			CharactersSet: characterSet,
			encounterPage: 0,
			encounterPageSize: 6,
			encounterTotal: 0,
			encountersInCurrentPage: [],
			characterPage: 0,
			characterPageSize: 6,
			characterTotal: 0,
			charactersInCurrentPage: [],
		};

		// First page ever
		this.getPaginatedEncounters(0);
		// First page ever
		this.getPaginatedCharacters(0);
	}

	componentWillReceiveProps(nextProps: ICampaignDetailsProps) {
		if (isDeepStrictEqual(this.props.Campaign, nextProps.Campaign) == false) {
			let encounterSet = new Set<number | undefined>();
			let characterSet = new Set<number | undefined>();
			if (nextProps.Campaign.Encounters)
				encounterSet = new Set(nextProps.Campaign.Encounters.map(enc => enc.Id))
			if (nextProps.Campaign.Characters)
				characterSet = new Set(nextProps.Campaign.Characters.map(enc => enc.Id))
			this.setState({
				Name: nextProps.Campaign.Name,
				Summary: nextProps.Campaign.Summary,
				Notes: nextProps.Campaign.Notes,
				EncountersSet: encounterSet,
				CharactersSet: characterSet,
			});
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
				} as unknown as ICampaignDetailsState);
		});
	}

	getPaginatedEncounters(page: number) {
		var options = { method: 'GET',
			url: API_URL + '/encounter/get/' + page + '/' + this.state.encounterPageSize,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json' ,
				'Authorization': CookieManager.UserToken('session_token')
			},
			json: true
		};

		request(options)
			.then((body: IEncounterGetResponse) => {
				this.setState({
					encountersInCurrentPage: body.content,
					encounterTotal: body.total,
				});
			})
			.catch((error: string) => {
				// There was an error retrieving the characters. Just return empty array.
				// No need to print a modal.
				this.setState({
					encountersInCurrentPage: [] as ICharacterData[],
					encounterTotal: 0,
				});
			});
	}

	getPaginatedCharacters = (page: number) => {
		var options = { method: 'GET',
			url: API_URL + '/character/get/' + page + '/' + this.state.characterPageSize,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json' ,
				'Authorization': CookieManager.UserToken('session_token')
			},
			json: true
		};

		request(options)
			.then((body: ICharacterGetResponse) => {
				this.setState({
					charactersInCurrentPage: body.content,
					characterTotal: body.total,
				});
			})
			.catch((error: string) => {
				// There was an error retrieving the characters. Just return empty array.
				// No need to print a modal.
				this.setState({
					charactersInCurrentPage: [] as ICharacterData[],
					characterTotal: 0,
				});
			});
	}

	handleEncounterSelect = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, id?: number) => {
		const newEncountersSet = new Set(this.state.EncountersSet);
		if (newEncountersSet.has(id)) {
			newEncountersSet.delete(id);
		} else {
			newEncountersSet.add(id);
		}
		this.setState({
			EncountersSet: newEncountersSet
		})
	}

	handleCharacterSelect = (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, id?: number) => {
		const newCharactersSet = new Set(this.state.CharactersSet);
		if (newCharactersSet.has(id)) {
			newCharactersSet.delete(id);
		} else {
			newCharactersSet.add(id);
		}
		this.setState({
			CharactersSet: newCharactersSet
		})
	}

	handleEncounterPageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
		this.setState({ encounterPage: page });
		this.getPaginatedEncounters(page);
	}

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	handleEncounterPageSizeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		this.setState({
			encounterPageSize: this.stringToNumber(event.target.value) || 6,
			encounterPage: 0
		}, () => this.getPaginatedEncounters(0));
	}

	handleCharacterPageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
		this.setState({ encounterPage: page });
		this.getPaginatedCharacters(page);
	}

	handleCharacterPageSizeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		this.setState({
			characterPageSize: this.stringToNumber(event.target.value) || 6,
			characterPage: 0
		}, () => this.getPaginatedCharacters(0));
	}

	public GetCampaign = (): ICampaignData => {
		return {
			Name: this.state.Name,
			Summary: this.state.Summary,
			Notes: this.state.Notes,
			Encounters: Array.from(this.state.EncountersSet).map(id => ({ Id: id })),
			Characters: Array.from(this.state.CharactersSet).map(id => ({ Id: id }))
		}
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
					<Paper>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell padding='checkbox'>Selected</TableCell>
								<TableCell padding='none'>Encounter</TableCell>
								<TableCell align='right'>Description</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{(this.state.encountersInCurrentPage).map((encounter: IEncounterData) => (
								<TableRow id={'encounter'+encounter.Id} key={encounter.Id}
									hover
									onClick={event => this.props.disabled ? null : this.handleEncounterSelect(event, encounter.Id)}
									role='checkbox'
									selected={this.state.EncountersSet.has(encounter.Id)}>
									<TableCell padding='checkbox'>
										<Checkbox checked={this.state.EncountersSet.has(encounter.Id)} disabled={this.props.disabled} />
									</TableCell>
									<TableCell component='th' scope='row' padding='none'>
										{encounter.Name}
									</TableCell>
									<TableCell align='right'>{(encounter.Description || '').substr(0,200)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<TablePagination
						rowsPerPageOptions={[6,12]}
						component='div'
						count={this.state.encounterTotal}
						rowsPerPage={this.state.encounterPageSize}
						page={this.state.encounterPage}
						onChangePage={this.handleEncounterPageChange}
						onChangeRowsPerPage={this.handleEncounterPageSizeChange}
						SelectProps={{id: 'Encounter', native: true}}
						backIconButtonProps={{id: 'EncounterBack'}}
						nextIconButtonProps={{id: 'EncounterNext'}} />
					</Paper>
				</Grid>
				<Grid item xs={12} >
					<Paper>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell padding='checkbox'>Selected</TableCell>
								<TableCell padding='none'>Character</TableCell>
								<TableCell align='right'>Level</TableCell>
								<TableCell align='right'>Race</TableCell>
								<TableCell align='right'>Class</TableCell>
								<TableCell align='right'>Max HP</TableCell>
								<TableCell align='right'>AC</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{(this.state.charactersInCurrentPage).map((character: ICharacterData) => (
								<TableRow id={'character'+character.Id} key={character.Id}
									hover
									onClick={event => this.props.disabled ? null : this.handleCharacterSelect(event, character.Id)}
									role='checkbox'
									selected={this.state.CharactersSet.has(character.Id)}>
									<TableCell padding='checkbox'>
										<Checkbox checked={this.state.CharactersSet.has(character.Id)} disabled={this.props.disabled} />
									</TableCell>
									<TableCell component='th' scope='row' padding='none'>
										{character.Name}
									</TableCell>
									<TableCell align='right'>{character.Level}</TableCell>
									<TableCell align='right'>{character.Race}</TableCell>
									<TableCell align='right'>{character.Class}</TableCell>
									<TableCell align='right'>{character.MaxHealth}</TableCell>
									<TableCell align='right'>{character.ArmorClass}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<TablePagination
						rowsPerPageOptions={[6,12]}
						component='div'
						count={this.state.characterTotal}
						rowsPerPage={this.state.characterPageSize}
						page={this.state.characterPage}
						onChangePage={this.handleCharacterPageChange}
						onChangeRowsPerPage={this.handleCharacterPageSizeChange}
						SelectProps={{id: 'Character', native: true}}
						backIconButtonProps={{id: 'CharacterBack'}}
						nextIconButtonProps={{id: 'CharacterNext'}} />
					</Paper>
				</Grid>
			</Grid>
		);
	}
}