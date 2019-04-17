import * as React from 'react';
import * as request from 'request';
import { Input, Control, Label, Button, Tile, Subtitle, Modal, ModalContent, ModalBackground, Box } from 'bloomer';
import { API_URL } from "../../../../../config"
import { CookieManager } from "../../../../../cookie";
import * as EncounterInterface from '../../../../../encounter';
import * as CampaignInterface from '../../../../../campaign';

import 'bulma/css/bulma.css';

interface ICampaignDeleteResponse {
	status: number,
	messages: string[]
}

export interface ICampaignDetailsState {
	campaign: CampaignInterface.ICampaignState,
	modal: {
		open: boolean,
		message: string
	}
}

export class CampaignDetails extends React.Component<any, ICampaignDetailsState> {
	constructor(props: any) {
		super(props);
		this.state = {
			campaign: this.props.campaign,
			modal: {
				open: false,
				message: ""
			}
		}
		this.preprocessMissingCampaignData();
	}

	isEmptyObject(obj: CampaignInterface.ICampaignState) {
		for(var key in obj) {
			if(obj.hasOwnProperty(key))
				return false;
		}
		return true;
	}

	// For now, we are not getting the encounters of an campaign from the backend.
	// Once the backend is fixed, we can get rid of this function.
	preprocessMissingCampaignData() {
		let campaign = this.state.campaign;
		if(campaign.Encounters == null){
			campaign.Encounters = [] as EncounterInterface.IEncounterState[];
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

	deleteCampaign = (event: React.FormEvent) => {
		event.preventDefault();
		let campaign = this.state.campaign;
		var options = { method: 'POST',
			url: API_URL + '/campaign/delete',
			timeout: 2000,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json' ,
				'Authorization': CookieManager.UserToken('session_token')
			},
			body:
			{
				Id: campaign.Id,
			},
			json: true
		};
		request(options, (error: string, response: any, body: ICampaignDeleteResponse) => {
			if (error) {
				this.openModal("There has been a server error when deleting the campaign. Please try again later.");
			} else {
				let { status, messages } = body
				if (status == 201){
					this.openModal("The campaign is successfully deleted! Click anywhere to be redirected to the catalogue.");
				}
				else{
					let message = "There has been an error deleting the campaign. "
					if (messages) message = messages.join(' ');
					this.openModal(message);
				}
			}
		});
	}

	isExists(attribute: string | number | undefined) {
		if(attribute == undefined){
			return "N/A";
		}
		else{
			return attribute;
		}
	}

	render() {
		if(!this.isEmptyObject(this.state.campaign)) {
			let campaign = this.state.campaign;
			return (
				<div>
					<form>
						<h1 className="page-title">Campaign Details</h1>
							<Control>
								<Label>Campaignnnnn Name</Label>
								<Input  value={campaign.Name} id="name" label="Campaign Name" readOnly/>
							</Control>
							<Control>
								<Label>Campaign Summary</Label>
								<Input  value={campaign.Summary} id="description" label="Campaign Summary" readOnly/>
							</Control>
							<Control>
								<Label>Campaign Notes</Label>
								<Input  value={campaign.Notes} id="description" label="Campaign Notes" readOnly/>
							</Control>
							<Tile className="box" isVertical>
								<Subtitle>Encounters</Subtitle>
								{/* {campaign.Encounters.map(encounter => (
									<Control key={encounter.Id}>
										<Label>{this.isExists(encounter.Name)} {this.isExists(encounter.Id)}</Label>
									</Control>
								))} */}
							</Tile>
						<Button className="button" id="deleteCampaignButton" onClick = {this.deleteCampaign}> Delete Campaign </Button>
						<Button className="button" type="submit" disabled> Edit Campaign </Button>
						<Button className="button" onClick = {this.props.resetParentState}> Return to Game Components </Button>
					</form>
					<Modal id='campaignDeletionModal' isActive={this.state.modal.open}>
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
			return (<div id="errorMessageNoCampaign">No campaign is selected.</div>);
		}
	}
}