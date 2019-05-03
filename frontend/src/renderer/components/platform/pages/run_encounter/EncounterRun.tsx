import * as React from 'react';
var request = require('request-promise-native');
import { API_URL } from '../../../../../config';
import { CookieManager } from '../../../../../cookie';

import 'bulma/css/bulma.css';

import { IEncounterData } from '../../../../../encounter';
import { Modal, ModalBackground, ModalContent, Box } from 'bloomer';
import { Grid, Typography, Button, TextField } from '@material-ui/core';
import { BaseEntity, EntityTypes } from './entitiy/BaseEntity';
import { MonsterCRUD, CRUDProcess } from '../../../MonsterCRUD';
import { CharacterCRUD } from '../../../CharacterCRUD';
import { ICampaignData } from '../../../../../campaign';
import { IMonsterData } from '../../../../../monster';
import { ICharacterData } from '../../../../../character';

export interface IEncounterRunProps {
	EncounterId: number;
	CampaignId?: number;
}

export interface IEncounterRunState {
	SelectedMosnter: number,
	SelectedCharacter: number,
	SelectedProcess: CRUDProcess,
	Initiatives: IInitiativeSort[],
	Description: string,
	Notes: string,
	Summary: string,
	Turn: number,
	width: number,
	height: number,
	modal: {
		open: boolean;
		message: string;
	};
	Encounter: IEncounterData,
	Campaign: ICampaignData,
}

export interface IEncounterGetOneResponse {
	status: number,
	messages: string[],
	content: IEncounterData,
}

export interface ICampaignGetOneResponse {
	status: number,
	messages: string[],
	content: ICampaignData,
}

interface IInitiativeSort {
	Initiative: number;
	Dextarity?: number;
	Index: number;
	Type: keyof EntityTypes;
	Source: IMonsterData[] | ICharacterData[];
}

export class EncounterRun extends React.Component<IEncounterRunProps, IEncounterRunState> {
	constructor(props: IEncounterRunProps) {
		super(props);
		this.state = {
			SelectedMosnter: -1,
			SelectedCharacter: -1,
			SelectedProcess: CRUDProcess.Read,
			Description: '',
			Notes: '',
			Summary: '',
			Turn: 0,
			width: 0,
			height: 0,
			modal: {
				open: false,
				message: '',
			},
			Initiatives: [],
			Encounter: {
				Name: '',
				Description: '',
				Monsters: []
			},
			Campaign: {
				Name: '',
				Encounters: [],
				Characters: []
			}
		};
	}

	openModal = (messageText: string) => {
		const modal = this.state.modal;
		this.setState({ modal: {...modal, open: true, message: messageText }});
	};

	closeModal = () => {
		const modal = this.state.modal;
		this.setState({ modal: {...modal, open: false }});
	};

	componentDidMount = () => {
		this.updateWindowDimensions()
		window.addEventListener('resize', this.updateWindowDimensions);
		let options = { method: 'GET',
			url: API_URL + '/encounter/' + this.props.EncounterId,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Authorization': CookieManager.UserToken('session_token')
			},
			json: true
		};
		request(options)
			.then((body: IEncounterGetOneResponse) => {
				if (body.status == 201) { // success
					const initiatives: IInitiativeSort[] = new Array(...this.state.Initiatives);
					if (body.content.Monsters)
						body.content.Monsters.map((mon, index) => initiatives.push({
							Initiative: Math.ceil(Math.random() * 20),
							Index: index,
							Dextarity: mon.AbilityScores.Dexterity,
							Type: 'Monster',
							Source: body.content.Monsters as IMonsterData[]
						}));
					initiatives.sort((a,b) => {
						if (a.Initiative > b.Initiative) {
							return -1
						} else if (a.Initiative < b.Initiative) {
							return 1
						} else {
							return (a.Dextarity ? a.Dextarity : 0) < (b.Dextarity ? b.Dextarity : 0) ? 1 : -1;
						}
					});
					this.setState({
						Description: body.content.Description || '',
						Initiatives: initiatives,
						Encounter: body.content
					});
				} else if (body.messages) {
					// TODO: change backend so it sends better error messages.
					// TODO: parse the error messages so they show better.
					// TODO: maybe the messages from the server shouldn't be
					// a list of strings but a JSON object so things are
					// grouped together. Easier to parse?
					this.openModal("Error finding encounter: "+body.messages.toString());
				}else{
					this.openModal("There was an error retreiving the encounter. Please try again later.")
				}
				if(this.props.CampaignId){
					options = { method: 'GET',
						url: API_URL + '/campaign/' + this.props.CampaignId,
						headers:
						{
							'Cache-Control': 'no-cache',
							'Authorization': CookieManager.UserToken('session_token')
						},
						json: true
					};
					request(options)
						.then((body: ICampaignGetOneResponse) => {
							if (body.status == 201) { // success
								const initiatives: IInitiativeSort[] = new Array(...this.state.Initiatives);
								if (body.content.Characters)
									body.content.Characters.map((char, index) => initiatives.push({
										Initiative: Math.ceil(Math.random() * 20),
										Index: index,
										Dextarity: undefined,
										Type: 'Player',
										Source: body.content.Characters as ICampaignData[]
									}));
								initiatives.sort((a,b) => {
									if (a.Initiative > b.Initiative) {
										return -1
									} else if (a.Initiative < b.Initiative) {
										return 1
									} else {
										return (a.Dextarity ? a.Dextarity : 0) < (b.Dextarity ? b.Dextarity : 0) ? 1 : -1;
									}
								});
								this.setState({
									Notes: body.content.Notes ? body.content.Notes : '',
									Summary: body.content.Summary ? body.content.Summary : '',
									Initiatives: initiatives,
									Campaign: body.content
								});
							} else if (body.messages) {
								// TODO: change backend so it sends better error messages.
								// TODO: parse the error messages so they show better.
								// TODO: maybe the messages from the server shouldn't be
								// a list of strings but a JSON object so things are
								// grouped together. Easier to parse?
								this.openModal("Error finding campaign: "+body.messages.toString());
							}else{
								this.openModal("There was an error retreiving the campaign. Please try again later.")
							}
						})
						.catch((error: string) => {
							this.openModal("There was an error sending your request.")
						});
				}
			})
			.catch((error: string) => {
				this.openModal("There was an error sending your request.")
			})
	}


	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions = () => {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	public ViewMonster = (event: React.MouseEvent<HTMLButtonElement>) => {
		const value = this.stringToNumber(event.currentTarget.value);
		this.setState({
			SelectedMosnter: value != undefined ? value : -1,
			SelectedCharacter: -1,
			SelectedProcess: CRUDProcess.Read,
		});
	}

	/*public EditMonster = (event: React.MouseEvent<HTMLButtonElement>) => {
		const value = this.stringToNumber(event.currentTarget.value);
		this.setState({
			SelectedMosnter: value != undefined ? value : -1,
			SelectedCharacter: -1,
			SelectedProcess: CRUDProcess.Edit,
		});
	}*/

	public ViewCharacter = (event: React.MouseEvent<HTMLButtonElement>) => {
		const value = this.stringToNumber(event.currentTarget.value);
		this.setState({
			SelectedMosnter: -1,
			SelectedCharacter: value != undefined ? value : -1,
			SelectedProcess: CRUDProcess.Read,
		});
	}

	/*public EditCharacter = (event: React.MouseEvent<HTMLButtonElement>) => {
		const value = this.stringToNumber(event.currentTarget.value);
		this.setState({
			SelectedMosnter: -1,
			SelectedCharacter: value != undefined ? value : -1,
			SelectedProcess: CRUDProcess.Edit,
		});
	}*/

	nextTurn = (event: React.MouseEvent<HTMLButtonElement>) => {
		this.setState((prevState: IEncounterRunState) =>
			({ Turn: prevState.Turn + 1 }));
	}

	handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		this.setState({
			Description: value,
		});
	}

	handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		this.setState({
			Notes: value,
		});
	}

	handleSummaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		this.setState({
			Summary: value,
		});
	}

	render() {
		const currentEntity = this.state.Initiatives[this.state.Turn%this.state.Initiatives.length]
		return (
			<div className="encounter-run-containter">
				<Grid container alignItems='baseline' spacing={16} >
					<Grid container item style={{maxHeight: (this.state.height-55), overflow: 'auto'}} xs={12} md={3} spacing={8} >
						<Grid item xs={6} md={12}>
							<Typography id='Name' align='center' variant='h6' >{this.state.Encounter.Name}</Typography>
						</Grid>
						<Grid item xs={3} md={12}>
							<Typography id='Turn' align='center' variant='body1' >
								{
									'Turn: '+
									(this.state.Turn%this.state.Initiatives.length + 1)+
									', Round: '+
									(Math.floor(this.state.Turn/this.state.Initiatives.length) + 1)
								}
							</Typography>
						</Grid>
						<Grid item xs={3} md={12}>
							<Button id='NextTurn' fullWidth variant="contained" onClick={this.nextTurn} >
								Next Turn
							</Button>
						</Grid>
						<Grid item xs={12} >
							<Typography id='CurrentEntity' align='center' variant='h6' >
								{
									currentEntity ? currentEntity.Source[currentEntity.Index].Name : 'No Entities'
								}
							</Typography>
						</Grid>
						<Grid item xs={12} >
							<TextField
								id='EncounterDescription'
								label='Encounter Description'
								multiline
								margin='normal'
								fullWidth
								rowsMax={10}
								rows={10}
								value={this.state.Description}
								onChange={this.handleDescriptionChange} />
						</Grid>
						<Grid item xs={12} >
							<TextField
								id='CampaignNotes'
								label='Campaign Notes'
								multiline
								margin='normal'
								fullWidth
								rowsMax={10}
								rows={10}
								value={this.state.Notes}
								onChange={this.handleNotesChange} />
						</Grid>
						<Grid item xs={12} >
							<TextField
								id='CampaignSummary'
								label='Campaign Summary'
								multiline
								margin='normal'
								fullWidth
								rowsMax={10}
								rows={10}
								value={this.state.Summary}
								onChange={this.handleSummaryChange} />
						</Grid>
					</Grid>
					<Grid container item style={{maxHeight: (this.state.height-55), overflow: 'auto'}} xs={12} md={3} spacing={8} >
						<Grid item xs={12}>
							{this.state.Initiatives.map((value: IInitiativeSort, index: number) => (
								<BaseEntity
									id={value.Type+value.Source[value.Index].Id}
									key={index}
									Id={index}
									Initiative={value.Initiative}
									View={value.Type == 'Monster' ? this.ViewMonster : this.ViewCharacter}
									//Edit={value.Type == 'Monster' ? this.EditMonster : this.EditCharacter}
									Entity={{
										EntityType: value.Type,
										Id: value.Source[value.Index].Id as number,
										Name: value.Source[value.Index].Name,
										ArmorClass: value.Source[value.Index].ArmorClass as number,
										HitPoints: (value.Type == 'Monster') ? (value.Source[value.Index] as IMonsterData).HitPoints as number : (value.Source[value.Index] as ICharacterData).MaxHealth as number
									}} />
							))}
						</Grid>
						{/*<Grid item xs={12}>
							<Button fullWidth variant="contained" onClick={this.nextTurn} >
								Add From Catalog
							</Button>
						</Grid>*/}
					</Grid>
					<Grid container item style={{maxHeight: (this.state.height-55), overflow: 'auto'}} xs={12} md={6} spacing={8} >
						<Grid item xs={12}>
							{this.state.SelectedMosnter != -1 ?
								<MonsterCRUD Process={this.state.SelectedProcess} Id={this.state.SelectedMosnter} /> :
							(this.state.SelectedCharacter != -1 ?
								<CharacterCRUD Process={this.state.SelectedProcess} Id={this.state.SelectedCharacter} /> :
								<Typography align='center' variant='h6' >No Entity Selected</Typography>)}
						</Grid>
					</Grid>
				</Grid>
				<Modal id='encounterRunModal' isActive={this.state.modal.open}>
					<ModalBackground id='modalBackground' onClick={()=>{
						this.closeModal();
					}}/>
					<ModalContent>
						<Box>
							<span id="ModalMessage">{this.state.modal.message}</span>
						</Box>
					</ModalContent>
				</Modal>
			</div>
		);
	}
}