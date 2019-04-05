import * as React from 'react';
import { Input, Control, Label, Button, Tile, Subtitle } from 'bloomer';
import * as CampaignInterface from '../../../../../campaign';
// import * as MonsterInterface from '../../../../../monster';

import 'bulma/css/bulma.css';

export interface ICampaignDetailsState {
	campaign: CampaignInterface.ICampaignState,
}

export class CampaignDetails extends React.Component<any, ICampaignDetailsState> {
	constructor(props: any) {
		super(props);
		this.state = {
			campaign: this.props.campaign,
		}
		//this.preprocessMissingEncounterData();
	}

	isEmptyObject(obj: CampaignInterface.ICampaignState) {
		for(var key in obj) {
			if(obj.hasOwnProperty(key))
				return false;
		}
		return true;
	}

	// For now, we are not getting the monsters of an encounter from the backend.
	// Once the backend is fixed, we can get rid of this function.
	preprocessMissingEncounterData() {
		let campaign = this.state.campaign;
		if(campaign.Monsters == null){
			campaign.Monsters = [] as MonsterInterface.IMonsterState[];
		}
	}

	render() {
		if(!this.isEmptyObject(this.state.campaign)) {
			let campaign = this.state.campaign;
			return (
				<form>
					<h1 className="page-title">Campaign Details</h1>
						<Control>
							<Label>Campaign Name</Label>
							<Input  value={campaign.Name} id="name" label="Campaign Name" readOnly/>
						</Control>
						<Control>
							<Label>Campaign Description</Label>
							<Input  value={campaign.Description} id="description" label="Campaign Description" readOnly/>
						</Control>
						{/*<Tile className="box" isVertical>
							<Subtitle>Monsters</Subtitle>
							{campaign.Monsters.map(monster => (
								<Control key={monster.Id}>
									<Label>{monster.Name} {monster.Id}</Label>
								</Control>
							))}
						</Tile>*/}
					<Button className="button" type="submit" disabled> Edit Campaign </Button>
					<Button className="button" onClick = {this.props.resetParentState}> Return to Game Components </Button>
				</form>
			);
		}
		else{
			return (<div>No campaign is selected.</div>);
		}
	}
}