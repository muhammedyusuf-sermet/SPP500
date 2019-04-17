import * as React from 'react';

import 'bulma/css/bulma.css';

import { isDeepStrictEqual } from 'util';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, FormControl, InputLabel, Input, Grid, FormControlLabel, Switch, Button } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export interface IBaseEntityProps {
	Id: number
	Initiative: number;
	View: (event: React.MouseEvent<HTMLButtonElement>) => void,
	Edit: (event: React.MouseEvent<HTMLButtonElement>) => void,
	// initial values
	Entity: {
		EntityType: keyof EntityTypes;
		Id: number;
		Name: string;
		ArmorClass: number;
		HitPoints: number;
	}
}

export const EntityConditions = [
	'Blinded',
	'Charmed',
	'Deafened',
	'Frightened',
	'Grappled',
	'Incapacitated',
	'Invisible',
	'Paralyzed',
	'Petrified',
	'Poisoned',
	'Prone',
	'Restrained',
	'Stunned',
	'Unconscious',
]

export type EntityTypes = {
	Player: string,
	Monster: string
}

export interface IBaseEntityState {
	// data
	CurrentHitPoints?: number;
	Conditions?: Set<string>;
}

export class BaseEntity extends React.Component<IBaseEntityProps, IBaseEntityState> {
	constructor(props: IBaseEntityProps) {
		super(props);
		this.state = {
			CurrentHitPoints: this.props.Entity.HitPoints,
			Conditions: new Set()
		};
	}

	componentWillReceiveProps(nextProps: IBaseEntityProps) {
		if (isDeepStrictEqual(this.props.Entity, nextProps.Entity) == false)
			this.setState({
				CurrentHitPoints: nextProps.Entity.HitPoints,
				Conditions: new Set()
			});
	}

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = this.stringToNumber(event.target.value);
		const name = event.currentTarget.name;
		this.setState({
			[name]: value,
		});
	}

	handleConditionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		const newConditions = new Set(this.state.Conditions ? this.state.Conditions : []);
		if (newConditions.has(value)){
			newConditions.delete(value);
		} else {
			newConditions.add(value);
		}
		this.setState({
			Conditions: newConditions
		})
	}

	render() {
		let conditions = '';
		if (this.state.Conditions)
			for (let value of this.state.Conditions)
				conditions = conditions + ', ' + value;
			conditions = conditions.substring(2);
		return (
			<ExpansionPanel CollapseProps={{timeout: 100}} >
				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
					<Grid container spacing={8} >
						<Grid item xs={6}>
							<Typography variant='h6' >{this.props.Entity.Name}</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography className='body1' >{'Initative: '+this.props.Initiative}</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography className='body1' >{'AC: '+this.props.Entity.ArmorClass}</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography className='body1' >{'HP: '+this.state.CurrentHitPoints+'/'+this.props.Entity.HitPoints}</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography className='body1' >{conditions}</Typography>
						</Grid>
					</Grid>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Grid container spacing={8} >
						<Grid item xs={12}>
							<FormControl className='formControl' fullWidth >
								<InputLabel htmlFor="CurrentHitPoints">Current HP</InputLabel>
								<Input
									id='CurrentHitPoints'
									type='number'
									value={this.state.CurrentHitPoints != undefined ? this.state.CurrentHitPoints : ''}
									name='CurrentHitPoints'
									onChange={this.handleNumberChange} />
							</FormControl>
						</Grid>
						{EntityConditions.map(conditionName =>
							<Grid item xs={6} sm={3} md={12} lg={6} xl={4} key={conditionName}>
							<FormControlLabel
								control={
									<Switch
										id={conditionName}
										value={conditionName}
										checked={this.state.Conditions ? this.state.Conditions.has(conditionName) : false}
										onChange={this.handleConditionChange}
										color="primary" />
								}
								label={conditionName}
								labelPlacement='start' />
							</Grid>
						)}
						<Grid item xs={12}>
							<Button variant="contained" value={this.props.Entity.Id} onClick={this.props.View} >
								View
							</Button>
							<Button variant="contained" value={this.props.Entity.Id} onClick={this.props.Edit} >
								Edit
							</Button>
							{/*<Button variant="contained" color="secondary" value={this.props.Entity.Id} onClick={this.deleteMonster} >
								Delete
								<DeleteIcon/>
							</Button>*/}
						</Grid>
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}