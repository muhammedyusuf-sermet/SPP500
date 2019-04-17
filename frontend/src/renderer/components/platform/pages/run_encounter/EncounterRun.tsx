import * as React from 'react';
var request = require('request-promise-native');
import { API_URL } from '../../../../../config';
import { CookieManager } from '../../../../../cookie';

import 'bulma/css/bulma.css';

import { IEncounterState } from '../../../../../encounter';
import { Modal, ModalBackground, ModalContent, Box } from 'bloomer';
import { Grid, Typography, Button, TextField } from '@material-ui/core';
import { BaseEntity } from './entitiy/BaseEntity';
import { IMonsterState } from '../../../../../monster';
import { MonsterCRUD, MonsterCRUDState } from '../../../MonsterCRUD';

export interface IEncounterRunProps {
	Id?: number;
}

export interface IEncounterRunState {
	SelectedMosnter: number,
	SelectedProcess: MonsterCRUDState,
	Turn: number,
	modal: {
		open: boolean;
		message: string;
	};
	Encounter: IEncounterState
}

export interface IEncounterGetOneResponse {
	status: number,
	messages: string[],
	content: IEncounterState,
}

export class EncounterRun extends React.Component<IEncounterRunProps, IEncounterRunState> {
	constructor(props: IEncounterRunProps) {
		super(props);
		this.state = {
			SelectedMosnter: -1,
			SelectedProcess: MonsterCRUDState.Read,
			Turn: 0,
			modal: {
				open: false,
				message: '',
			},
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
					this.setState({
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

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	viewMonster = (event: React.MouseEvent<HTMLButtonElement>) => {
		const value = this.stringToNumber(event.currentTarget.value);
		this.setState({
			SelectedMosnter: value ? value : -1,
			SelectedProcess: MonsterCRUDState.Read,
		});
	}

	editMonster = (event: React.MouseEvent<HTMLButtonElement>) => {
		const value = this.stringToNumber(event.currentTarget.value);
		this.setState({
			SelectedMosnter: value ? value : -1,
			SelectedProcess: MonsterCRUDState.Edit,
		});
	}

	nextTurn = (event: React.MouseEvent<HTMLButtonElement>) => {
		this.setState((prevState: IEncounterRunState) =>
			({ Turn: prevState.Turn + 1 }));
	}

	render() {
		return (
			<div className="encounter-run-containter">
				<Grid container spacing={0} >
					<Grid container item xs={12} md={3} spacing={8} >
						<Grid item xs={6} md={12}>
							<Typography align='center' variant='h6' >{this.state.Encounter.Name}</Typography>
						</Grid>
						<Grid item xs={3} md={12}>
							<Typography align='center' variant='body1' >{this.state.Turn}</Typography>
						</Grid>
						<Grid item xs={3} md={12}>
							<Button fullWidth variant="contained" onClick={this.nextTurn} >
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
							/>
						</Grid>
					</Grid>
					<Grid container item xs={12} md={3} spacing={8} >
						<Grid item xs={12}>
							{this.state.Encounter.Monsters.map((monster: IMonsterState) => (
								<BaseEntity
									key={monster.Name}
									Id={0}
									Initiative={0}
									View={this.viewMonster}
									Edit={this.editMonster}
									Entity={{
										EntityType: 'Monster',
										Id: monster.Id ? monster.Id : -1,
										Name: monster.Name,
										ArmorClass: monster.ArmorClass ? monster.ArmorClass : -1,
										HitPoints: monster.HitPoints ? monster.HitPoints : -1
									}} />
							))}
						</Grid>
						<Grid item xs={12}>
							<Button fullWidth variant="contained" onClick={this.nextTurn} >
								Add From Catalog
							</Button>
						</Grid>
					</Grid>
					<Grid item xs={12} md={6} >
						{this.state.SelectedMosnter != -1 ?
							<MonsterCRUD Process={this.state.SelectedProcess} Id={this.state.SelectedMosnter} />
							: <Typography align='center' variant='h6' >No Monster Selected</Typography>}
					</Grid>
				</Grid>
				<Modal id='monsterCRUDModal' isActive={this.state.modal.open}>
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