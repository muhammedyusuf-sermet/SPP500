import * as React from 'react';
//TODO use validation to ensure the speeds make sense
//const Joi = require('joi');
//import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';
import { Tile, Subtitle, Field, Label, Control, Input } from 'bloomer';

export interface IMonsterSpeedBonusesProps {
	disabled?: boolean;
	// validation TODO not done yet
	//PayloadSchema: JoiObject;
	//ValidationOptions: ValidationOptions;
	// initial values
	initial: {
		[SpeedName: string]: number | undefined;
	}
}

export interface IMonsterSpeedBonusesState {
	[key: string]: number | string | undefined;
}

export class MonsterSpeedBonuses extends React.Component<IMonsterSpeedBonusesProps, IMonsterSpeedBonusesState> {
	constructor(props: IMonsterSpeedBonusesProps) {
		super(props);
		this.state = {
			...props.initial
		};
	}

	//TODO: Make speed its own dictionary of all the different monvement options.
	//private keyNames: string[] = ["SpeedLand", "SpeedSwim"];

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	handleMonsterSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = this.stringToNumber(event.target.value);
		const name = event.currentTarget.name;
		this.setState({
			[name]: value
		});
		/*TODO: Add validation and help messages
		Joi.validate(
			{ [name]: value },
			Joi.reach(this.props.PayloadSchema, ['Speeds']),
			this.props.ValidationOptions,
			(errors: ValidationError) => {
				this.setState({
					[name]: value,
					[name+'Error']: errors ? errors.details[0].message : undefined
				});
			});*/
	}

	render() {
		return (
			<Tile className="box" isVertical>
				<Subtitle>Movement Speed</Subtitle>
				<Field isGrouped='centered' isHorizontal>
					<Control isExpanded>
						<Label>Land Speed</Label>
						<Input
							id='SpeedLand'
							type='number'
							placeholder='Land Speed'
							autoComplete='SpeedLand'
							value={this.state.SpeedLand != undefined ? this.state.SpeedLand : ''}
							name='SpeedLand'
							onChange={this.handleMonsterSpeedChange} />
					</Control>
					<Control isExpanded>
						<Label>Swimming Speed</Label>
						<Input
							id='SpeedSwim'
							type='number'
							placeholder='Swimming Speed'
							autoComplete='SpeedSwim'
							value={this.state.SpeedSwim != undefined ? this.state.SpeedSwim : ''}
							name='SpeedSwim'
							onChange={this.handleMonsterSpeedChange} />
					</Control>
				</Field>
			</Tile>
		);
	}
}