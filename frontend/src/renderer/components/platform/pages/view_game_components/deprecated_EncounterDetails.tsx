import * as React from 'react';
import * as request from 'request';
import { Input, Control, Label, Button, Tile, Subtitle, Modal, ModalContent, ModalBackground, Box } from 'bloomer';
import { API_URL } from "../../../../../config"
import { CookieManager } from "../../../../../cookie";
import * as EncounterInterface from '../../../../../encounter';
import * as MonsterInterface from '../../../../../monster';

import 'bulma/css/bulma.css';

interface IEncounterDeleteResponse {
	status: number,
	messages: string[]
}

export interface IEncounterDetailsState {
	encounter: EncounterInterface.IEncounterState,
	modal: {
		open: boolean,
		message: string
	}
}

export class EncounterDetails extends React.Component<any, IEncounterDetailsState> {
	constructor(props: any) {
		super(props);
		this.state = {
			encounter: this.props.encounter,
			modal: {
				open: false,
				message: ""
			}
		}
		this.preprocessMissingEncounterData();
	}

	isEmptyObject(obj: EncounterInterface.IEncounterState) {
		for(var key in obj) {
			if(obj.hasOwnProperty(key))
				return false;
		}
		return true;
	}

	// For now, we are not getting the monsters of an encounter from the backend.
	// Once the backend is fixed, we can get rid of this function.
	preprocessMissingEncounterData() {
		let encounter = this.state.encounter;
		if(encounter.Monsters == null){
			encounter.Monsters = [] as MonsterInterface.IMonsterState[];
		}
	}

	openModal = (messageText: string) => {
		const modal = this.state.modal
		this.setState({ modal: {...modal, open: true, message: messageText }});
	};

	closeModal = () => {
		const modal = this.state.modal
		this.setState({ modal: {...modal, open: false }});
		this.props.resetParentState();
	};

	deleteEncounter = (event: React.FormEvent) => {
		event.preventDefault();
		let encounter = this.state.encounter;
		var options = { method: 'POST',
			url: API_URL + '/encounter/delete',
			timeout: 2000,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json' ,
				'Authorization': CookieManager.UserToken('session_token')
			},
			body:
			{
				Id: encounter.Id,
			},
			json: true
		};
		request(options, (error: string, response: any, body: IEncounterDeleteResponse) => {
			if (error) {
				this.openModal("There has been a server error when deleting the encounter. Please try again later.");
			} else {
				let { status, messages } = body
				if (status == 201){
					this.openModal("The encounter is successfully deleted! Click anywhere to be redirected to the catalogue.");
				}
				else{
					let message = "There has been an error deleting the encounter. "
					if (messages) message = messages.join(' ');
					this.openModal(message);
				}
			}
		});
	}

	render() {
		if(!this.isEmptyObject(this.state.encounter)) {
			let encounter = this.state.encounter;
			return (
				<div>
					<form>
						<h1 className="page-title">Encounter Details</h1>
							<Control>
								<Label>Encounter Name</Label>
								<Input  value={encounter.Name} id="name" label="Encounter Name" readOnly/>
							</Control>
							<Control>
								<Label>Encounter Description</Label>
								<Input  value={encounter.Description} id="name" label="Encounter Description" readOnly/>
							</Control>
							<Tile className="box" isVertical>
								<Subtitle>Monsters</Subtitle>
								{encounter.Monsters.map(monster => (
									<Control key={monster.Id}>
										<Label>{monster.Name} {monster.Id}</Label>
									</Control>
								))}
							</Tile>
						<Button className="button" id="deleteEncounterButton" onClick = {this.deleteEncounter}> Delete Encounter </Button>
						<Button className="button" type="submit" disabled> Edit Encounter </Button>
						<Button className="button" onClick = {this.props.resetParentState}> Return to Game Components </Button>
					</form>
					<Modal id='encounterDeletionModal' isActive={this.state.modal.open}>
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
		else{
			return (<div id="errorMessageNoEncounter">No encounter is selected.</div>);
		}
	}
}