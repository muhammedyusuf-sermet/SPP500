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
	[key: string]: boolean | number | undefined;
	// data
	Blinded?: boolean,
	Charmed?: boolean,
	Deafened?: boolean,
	Frightened?: boolean,
	Grappled?: boolean,
	Incapacitated?: boolean,
	Invisible?: boolean,
	Paralyzed?: boolean,
	Petrified?: boolean,
	Poisoned?: boolean,
	Prone?: boolean,
	Restrained?: boolean,
	Stunned?: boolean,
	Unconscious?: boolean,
	CurrentHitPoints: number;
}

export class BaseEntity extends React.Component<IBaseEntityProps, IBaseEntityState> {
	constructor(props: IBaseEntityProps) {
		super(props);
		this.state = {
			CurrentHitPoints: this.props.Entity.HitPoints
		};
	}

	componentWillReceiveProps(nextProps: IBaseEntityProps) {
		if (isDeepStrictEqual(this.props.Entity, nextProps.Entity) == false)
			this.setState({
				CurrentHitPoints: nextProps.Entity.HitPoints
			});
	}

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let value = this.stringToNumber(event.target.value);
		value = value ? value : 0;
		const name = event.currentTarget.name;
		this.setState({
			[name]: value,
		});
	}

	handleConditionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		this.setState((prevState) => ({
			[value]: !prevState[value]
		}))
	}

	render() {
		let conditions = '';
		for (let con of EntityConditions)
			if(this.state[con])
				conditions = conditions + ', ' + con;
		conditions = conditions.substring(2);
		return (
			<ExpansionPanel CollapseProps={{timeout: 100}} >
				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
					<Grid container spacing={8} >
						<Grid item xs={6}>
							<Typography id='Name' variant='h6' >{this.props.Entity.Name}</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography id='Initiative' className='body1' >{'Initative: '+this.props.Initiative}</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography id='ArmorClass' className='body1' >{'AC: '+this.props.Entity.ArmorClass}</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography id='HitPoints' className='body1' >{'HP: '+this.state.CurrentHitPoints+'/'+this.props.Entity.HitPoints}</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography id='Conditions' className='body1' >{conditions}</Typography>
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
									value={this.state.CurrentHitPoints}
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
										checked={this.state[conditionName] == true}
										onChange={this.handleConditionChange}
										color="primary" />
								}
								label={conditionName}
								labelPlacement='start' />
							</Grid>
						)}
						<Grid item xs={12}>
							<Button id={'View'+this.props.Entity.Id} variant="contained" value={this.props.Entity.Id} onClick={this.props.View} >
								View
							</Button>
							<Button id={'Edit'+this.props.Entity.Id} variant="contained" value={this.props.Entity.Id} onClick={this.props.Edit} >
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