import * as React from 'react';

import 'bulma/css/bulma.css';
import { Input, Label, Button, Checkbox, Control, Field, TextArea, Modal, ModalContent, ModalBackground, Box} from 'bloomer';
import { Redirect } from "react-router-dom"
import { API_URL } from "../../config"
import { CookieManager } from "../../cookie";

// Todo: Actually get the monsters from the db once the backend is ready
// Dummy array of monsters
const monsters = [	{"Id": "1", "Name": "Monster 1"},
					{"Id": "2", "Name": "Monster 2"},
					{"Id": "3", "Name": "Monster 3"}
				];

interface IEncounterResponse {
	status: number,
	messages: string,
	token: string
}

interface IEncounterCreationState {
	redirectToHome: boolean,
	checkedMonsters: Map,
	encounter: {
		name: string,
		description: string,
	},
	modal: {
		open: boolean,
		message: string
	}
}

export class EncounterCreation extends React.Component<any, IEncounterCreationState> {
	constructor(props: any) {
		super(props);
		this.state = {
			redirectToHome: false,
			checkedMonsters: new Map(),
			encounter: {
				name: "",
				description: "",
			},
			modal: {
				open: false,
				message: ""
			}
		}
	}

	handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const encounter = this.state.encounter
		this.setState({
			encounter: { ...encounter, name: event.target.value }
		})
	}

	handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const encounter = this.state.encounter
		this.setState({
			encounter: { ...encounter, description: event.target.value }
		})
	}

	handleMonsterCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.persist();
		//const id = event.target.attributes['data-id'].value;
		const id = event.target.name;
		const isChecked = event.target.checked;

		this.setState(prevState => ({ checkedMonsters: prevState.checkedMonsters.set(id, isChecked)}));
	}

	openModal = (messageText: string) => {
		const modal = this.state.modal
		this.setState({ modal: {...modal, open: true, message: messageText }});
	};

	closeModal = () => {
		const modal = this.state.modal
		this.setState({ modal: {...modal, open: false }});
	};

	createEncounter = (event: React.FormEvent) => {
		event.preventDefault();
		this.saveEncounter();
	}

	saveEncounter = (callback?: (message: string) => void) => {
		// Gather the selected monsters for this encounter
		const checkedMonsterIds = [ ...this.state.checkedMonsters.keys() ];
		const selectedMonsters = monsters.filter(function(monster){
			return checkedMonsterIds.indexOf(monster['Id']) > -1;
		});

		const request = require("request");
		const options = { method: 'POST',
			url: API_URL + '/encounter/create',
			timeout: 2000,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json',
				'Authorization': CookieManager.UserToken('session_token')
			},
			body:
			{
				Name: this.state.encounter.name,
				Description: this.state.encounter.description,
				Monsters: selectedMonsters
			},
			json: true
		};
		request(options, (error: string, response: string, body: IEncounterResponse) => {
			if (error) {
				if(callback)
					this.openModal("There has been a server error when saving the encounter. Please try again later.");
			} else {
				let { status, messages } = body
				if (status == 201){
					this.openModal("Hooray, the encounter is successfully saved!");
					this.setState({ redirectToHome: true});
				}
				else{
					let message = "There has been an error saving the encounter. Please check your input and try again."
					if (messages) {
						message = messages.join(' ');
					}
					this.openModal(message);
				}
			}
		});
	}

	cancel = (event: React.FormEvent) => {
		event.preventDefault();
		this.setState({ redirectToHome: true});
	}

	render() {
		return (
			this.state.redirectToHome ? <Redirect to="/"/> :
			<div>
				<form id="createEncounterForm" onSubmit={this.createEncounter}>
					<Field>
						<Label>Encounter Name</Label>
						<Control>
							<Input 	type="text"
									placeholder='Please enter the name of the encounter.'
									onChange={this.handleNameChange} />
						</Control>
					</Field>

					<Field>
					    <Label>Description</Label>
					    <Control>
					        <TextArea 	placeholder={'Please write the encounter description here.'}
					        			onChange={this.handleDescriptionChange} />
					    </Control>
					</Field>

					<Field>
						<Control>
							{monsters.map(monster => (
								<Checkbox 	key={monster.Id}
											name={monster.Id}
											checked={this.state.checkedMonsters.get(monster.Id)}
											onChange={this.handleMonsterCheckboxChange}>
									{monster.Name}
								</Checkbox>
							))}
						</Control>
					</Field>

					<Field isGrouped>
					    <Control>
					        <Button isColor='primary' type="submit">Submit</Button>
					    </Control>
					    <Control>
					        <Button isLink onClick={this.cancel}>Cancel</Button>
					    </Control>
					</Field>
				</form>
				<Modal id='encounterCreationModal' isActive={this.state.modal.open}>
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