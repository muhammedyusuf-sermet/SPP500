import * as React from 'react';

import 'bulma/css/bulma.css';
import { Input, Label, Button, Checkbox, Control, Field, TextArea, Modal, ModalContent, ModalBackground, Box} from 'bloomer';
import { Redirect } from "react-router-dom"
import { API_URL } from "../../config"
import { CookieManager } from "../../cookie";

// Todo: Actually get the encounters from the db once the backend is ready
// Dummy array of encounters
const encounters = [{"Id": "1", "Name": "Encounter 1"},
					{"Id": "2", "Name": "Encounter 2"},
					{"Id": "3", "Name": "Encounter 3"}
				];

interface ICampaignResponse {
	status: number,
	messages: string[]
}

export interface ICampaignCreationState {
	redirectToHome: boolean,
	checkedEncounters: Map<string, boolean>,
	campaign: {
		name: string,
		summary: string,
		notes: string,
	},
	modal: {
		open: boolean,
		message: string
	}
}

export class CampaignCreation extends React.Component<any, ICampaignCreationState> {
	constructor(props: any) {
		super(props);
		this.state = {
			redirectToHome: false,
			checkedEncounters: new Map(),
			campaign: {
				name: "x",
				summary: "",
				notes: "",
			},
			modal: {
				open: false,
				message: ""
			}
		}
	}

	handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const campaign = this.state.campaign
		this.setState({
			campaign: { ...campaign, name: event.target.value }
		})
	}

	handleSummaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const campaign = this.state.campaign
		this.setState({
			campaign: { ...campaign, summary: event.target.value }
		})
	}

	handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const campaign = this.state.campaign
		this.setState({
			campaign: { ...campaign, notes: event.target.value }
		})
	}

	handleEncounterCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.persist();
		//const id = event.target.attributes['data-id'].value;
		const id = event.target.name;
		const isChecked = event.target.checked;

		this.setState(prevState => ({ checkedEncounters: prevState.checkedEncounters.set(id, isChecked)}));
	}

	openModal = (messageText: string) => {
		const modal = this.state.modal
		this.setState({ modal: {...modal, open: true, message: messageText }});
	};

	closeModal = () => {
		const modal = this.state.modal
		this.setState({ modal: {...modal, open: false }});
	};

	createCampaign = (event: React.FormEvent) => {
		event.preventDefault();
		this.saveCampaign();
	}

	saveCampaign = (callback?: (message: string) => void) => {
		// Gather the selected encounters for this campaign
		const checkedEncounterIds = [ ...this.state.checkedEncounters.keys() ];
		const selectedEncounters = encounters.filter(function(encounter){
			return checkedEncounterIds.indexOf(encounter['Id']) > -1;
		});

		const request = require("request");
		const options = { method: 'POST',
			url: API_URL + '/campaign/create',
			timeout: 2000,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json',
				'Authorization': CookieManager.UserToken('session_token')
			},
			body:
			{
				Name: this.state.campaign.name,
				Summay: this.state.campaign.summary,
				Notes: this.state.campaign.notes,
				Encounters: selectedEncounters
			},
			json: true
		};
		request(options, (error: string, response: string, body: ICampaignResponse) => {
			if (error) {
				this.openModal("There has been a server error when saving the campaign. Please try again later.");
			} else {
				let { status, messages } = body
				if (status == 201){
					this.openModal("Hooray, the campaign is successfully saved!");
					this.setState({ redirectToHome: true});
				}
				else{
					let message = "There has been an error saving the campaign. Please check your input and try again."
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
			(this.state.redirectToHome && !this.state.modal.open) ? <Redirect to="/"/> :
			<div>
				<form id="createCampaignForm" onSubmit={this.createCampaign}>
					<Field>
						<Label>Campaign Name</Label>
						<Control>
							<Input
									id="campaign_name"
									type="text"
									placeholder='Please enter the name of the campaign.'
									onChange={this.handleNameChange} />
						</Control>
					</Field>

					<Field>
					    <Label>Summary</Label>
					    <Control>
					        <TextArea
					        			id="campaign_summary"
					        			placeholder={'Please write the campaign summary here.'}
					        			onChange={this.handleSummaryChange} />
					    </Control>
					</Field>

					<Field>
					    <Label>Notes</Label>
					    <Control>
					        <TextArea
					        			id="campaign_notes"
					        			placeholder={'Please write the campaign notes here.'}
					        			onChange={this.handleNotesChange} />
					    </Control>
					</Field>

					<Field>
						<Control>
							{encounters.map(encounter => (
								<Checkbox 	key={encounter.Id}
											name={encounter.Id}
											checked={this.state.checkedEncounters.get(encounter.Id)}
											onChange={this.handleEncounterCheckboxChange}>
									{encounter.Name}
								</Checkbox>
							))}
						</Control>
					</Field>

					<Field isGrouped>
					    <Control>
					        <Button isColor='primary' type="submit">Submit</Button>
					    </Control>
					    <Control>
					        <Button id="cancel" isLink onClick={this.cancel}>Cancel</Button>
					    </Control>
					</Field>
				</form>
				<Modal id='campaignCreationModal' isActive={this.state.modal.open}>
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