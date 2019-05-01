import * as React from 'react';
var request = require('request-promise-native');
import { API_URL } from '../../../../../config';
import { CookieManager } from '../../../../../cookie';

import 'bulma/css/bulma.css';

import { IEncounterData } from '../../../../../encounter';
import { Modal, ModalBackground, ModalContent, Box } from 'bloomer';
import { Grid, Typography, Button, TextField } from '@material-ui/core';
import { BaseEntity } from './entitiy/BaseEntity';
import { MonsterCRUD, CRUDProcess } from '../../../MonsterCRUD';

export interface IEncounterRunProps {
	Id?: number;
}

export interface IEncounterRunState {
	SelectedMosnter: number,
	SelectedProcess: CRUDProcess,
	Notes: string,
	Turn: number,
	width: number,
	height: number,
	modal: {
		open: boolean;
		message: string;
	};
	Initiatives: number[],
	Encounter: IEncounterData
}

export interface IEncounterGetOneResponse {
	status: number,
	messages: string[],
	content: IEncounterData,
}

export class EncounterRun extends React.Component<IEncounterRunProps, IEncounterRunState> {
	constructor(props: IEncounterRunProps) {
		super(props);
		this.state = {
			SelectedMosnter: -1,
			SelectedProcess: CRUDProcess.Read,
			Notes: '',
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

	componentDidMount() {
		this.updateWindowDimensions()
		window.addEventListener('resize', this.updateWindowDimensions);
		const options = { method: 'GET',
			url: API_URL + '/encounter/' + this.props.Id,
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
					const initiatives = []
					const numMonster = (body.content.Monsters || []).length;
					for(let i = 0; i < numMonster; i++)
						initiatives.push(i)
					let tmp, current, top = initiatives.length;
					if (top) {
						while (--top) {
							current = Math.floor(Math.random() * (top+1));
							tmp = initiatives[current];
							initiatives[current] = initiatives[top]
							initiatives[top] = tmp;
						}
					}
					this.setState({
						Notes: body.content.Description || '',
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
			SelectedProcess: CRUDProcess.Read,
		});
	}

	public EditMonster = (event: React.MouseEvent<HTMLButtonElement>) => {
		const value = this.stringToNumber(event.currentTarget.value);
		this.setState({
			SelectedMosnter: value != undefined ? value : -1,
			SelectedProcess: CRUDProcess.Edit,
		});
	}

	nextTurn = (event: React.MouseEvent<HTMLButtonElement>) => {
		this.setState((prevState: IEncounterRunState) =>
			({ Turn: prevState.Turn + 1 }));
	}

	handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		this.setState({
			Notes: value,
		});
	}

	render() {
		const encounterMosnters = this.state.Encounter.Monsters || [];
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
									(this.state.Turn%this.state.Initiatives.length)+
									', Round: '+
									(Math.floor(this.state.Turn/this.state.Initiatives.length))
								}
							</Typography>
						</Grid>
						<Grid item xs={3} md={12}>
							<Button id='NextTurn' fullWidth variant="contained" onClick={this.nextTurn} >
								Next Turn
							</Button>
						</Grid>
						<Grid item xs={12} >
							<TextField
								id='EncounterNotes'
								label='Notes'
								multiline
								margin='normal'
								fullWidth
								rowsMax={20}
								value={this.state.Notes}
								onChange={this.handleNotesChange} />
						</Grid>
					</Grid>
					<Grid container item style={{maxHeight: (this.state.height-55), overflow: 'auto'}} xs={12} md={3} spacing={8} >
						<Grid item xs={12}>
							{this.state.Initiatives.map((value: number, index: number) => (
								<BaseEntity
									key={encounterMosnters[value].Name}
									// TODO: change to unique id for the entity
									//  at this time there is only one monster
									//  per type for encounter. so this is unique.
									Id={encounterMosnters[value].Id as number}
									Initiative={index}
									View={this.ViewMonster}
									Edit={this.EditMonster}
									Entity={{
										EntityType: 'Monster',
										Id: encounterMosnters[value].Id as number,
										Name: encounterMosnters[value].Name,
										ArmorClass: encounterMosnters[value].ArmorClass as number,
										HitPoints: encounterMosnters[value].HitPoints as number
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
								<MonsterCRUD Process={this.state.SelectedProcess} Id={this.state.SelectedMosnter} />
								: <Typography align='center' variant='h6' >No Monster Selected</Typography>}
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