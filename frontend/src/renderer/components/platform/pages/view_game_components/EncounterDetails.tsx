import * as React from 'react';
import { Input, Control, Label, Button, Tile, Subtitle } from 'bloomer';
import * as EncounterInterface from '../../../../../encounter';
import * as MonsterInterface from '../../../../../monster';

import 'bulma/css/bulma.css';

export interface IEncounterDetailsState {
	encounter: EncounterInterface.IEncounterState,
}

export class EncounterDetails extends React.Component<any, IEncounterDetailsState> {
	constructor(props: any) {
		super(props);
		this.state = {
			encounter: this.props.encounter,
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

	render() {
		if(!this.isEmptyObject(this.state.encounter)) {
			let encounter = this.state.encounter;
			return (
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
					<Button className="button" type="submit" disabled> Edit Encounter </Button>
					<Button className="button" onClick = {this.props.resetParentState}> Return to Game Components </Button>
				</form>
			);
		}
		else{
			return (<div>No encounter is selected.</div>);
		}
	}
}