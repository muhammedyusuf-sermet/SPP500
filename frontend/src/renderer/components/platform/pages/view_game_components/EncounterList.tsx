import * as React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {EncounterDetails} from './EncounterDetails';
import * as EncounterInterface from '../../../../../encounter';

// Dummy array of encounters
import EncounterInstances from '../../../../../encounter_instances';

export interface IEncounterListState {
	viewEncounter: boolean,
	editEncounter: boolean,
	selectedEncounter: EncounterInterface.IEncounterState,
}

export class EncounterList extends React.Component<any, IEncounterListState> {
	constructor(props: any) {
		super(props);
		this.state = {
			viewEncounter: false,
			editEncounter: false,
			selectedEncounter: {} as EncounterInterface.IEncounterState,
		}
		this.resetState = this.resetState.bind(this);
	}

	resetState() {
		this.setState({ selectedEncounter: {} as EncounterInterface.IEncounterState});
		this.setState({ viewEncounter: false});
		this.setState({ editEncounter: false});
	}

	view = (encounter: EncounterInterface.IEncounterState) => {
		this.setState({ selectedEncounter: encounter});
		this.setState({ viewEncounter: true});
	}

	edit = (encounter: EncounterInterface.IEncounterState) => {
		this.setState({ selectedEncounter: encounter});
		this.setState({ editEncounter: true});
	}

	render() {
		if(!this.state.viewEncounter && !this.state.editEncounter){
			return (
				<div className= "layout card-grid">
					<Grid container spacing={40}>
						{EncounterInstances['EncounterInstances'].map(encounter => (
							<Grid item key={encounter.Id} sm={6} md={4} lg={3}>
								<Card className="card">
								  <CardMedia
									className="card-media"
									image="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" // eslint-disable-line max-len
									title="Image title"
								  />
								  <CardContent className="card-content">
									<Typography gutterBottom variant="h5" component="h2">
									  {encounter.Name} {encounter.Id}
									</Typography>
									<Typography>
									  {encounter.Description}.
									</Typography>
								  </CardContent>
								  <CardActions>
									<Button size="small" color="primary" onClick={() => this.view(encounter)}>
									  View
									</Button>
									<Button size="small" color="primary" onClick={() => this.edit(encounter)}>
									  Edit
									</Button>
								  </CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
				</div>
			)
		}
		else if(this.state.viewEncounter){
			return (<EncounterDetails encounter={this.state.selectedEncounter} resetParentState={this.resetState}/>);
		}
		else{
			// Todo: To enable editing, just use the same component as EncounterDetails:
			// enable edit button, remove readOnly, and add the code to submit the changes
			return (<div>Editing Feature is not yet enabled. Please check again later.</div>);
		}
	}
}
