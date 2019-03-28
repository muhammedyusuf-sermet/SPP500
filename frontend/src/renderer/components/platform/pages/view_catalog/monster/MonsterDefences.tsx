import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';
import { Tile, Subtitle, Field, Control, Label, Input, Help } from 'bloomer';

export interface IMonsterDefencesProps {
	disabled?: boolean,
	// validation
	PayloadSchema: JoiObject,
	ValidationOptions: ValidationOptions,
	// initial values
	initial: {
		ArmorClass?: number;
		HitPoints?: number;
		HitPointDistribution?: string;
	}
}

export interface IMonsterDefencesState {
	// data
	ArmorClass?: number;
	HitPoints?: number;
	HitPointDistribution?: string;
	// errors
	ArmorClassError?: string;
	HitPointsError?: string;
	HitPointDistributionError?: string;
}

export class MonsterDefences extends React.Component<IMonsterDefencesProps, IMonsterDefencesState> {
	constructor(props: IMonsterDefencesProps) {
		super(props);
		this.state = {
			...props.initial
		};
	}

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = this.stringToNumber(event.target.value);
		const name = event.currentTarget.name;
		Joi.validate(
			value,
			Joi.reach(this.props.PayloadSchema, [name]),
			this.props.ValidationOptions,
			(errors: ValidationError) => {
				this.setState({
					[name]: value,
					[name+'Error']: errors ? errors.details[0].message : undefined
				});
			});
	}

	handleStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let value: string|undefined = event.target.value;
		if (/^\s*$/.test(value))
			value = undefined
		Joi.validate(
			value,
			Joi.reach(this.props.PayloadSchema, [event.currentTarget.name]),
			this.props.ValidationOptions,
			(errors: ValidationError) => {
				this.setState({
					[event.currentTarget.name]: value,
					[event.currentTarget.name+'Error']: errors ? errors.details[0].message : undefined
				});
			});
	}

	render() {
		return (
			<Tile className="box" isVertical>
				<Subtitle>Armor Class and Hit Points</Subtitle>
				<Field>
					<Control>
						<Label>Armor Class</Label>
						<Input
							id='ArmorClass'
							type='number'
							placeholder='Armor Class'
							autoComplete='ArmorClass'
							value={this.state.ArmorClass != undefined ? this.state.ArmorClass : ''}
							name='ArmorClass'
							onChange={this.handleNumberChange} />
						<Help id='ArmorClass' isColor='danger'>{this.state.ArmorClassError}</Help>
					</Control>
				</Field>
				<Field isGrouped='centered' isHorizontal>
					<Control isExpanded>
						<Label>Hit Points</Label>
						<Input
							id='HitPoints'
							type='number'
							placeholder='Hit Points'
							autoComplete='HitPoints'
							value={this.state.HitPoints != undefined ? this.state.HitPoints : ''}
							name='HitPoints'
							onChange={this.handleNumberChange} />
						<Help id='HitPoints' isColor='danger'>{this.state.HitPointsError}</Help>
					</Control>
					<Control isExpanded>
						<Label>Hit Point Distribution</Label>
						<Input
							id='HitPointDistribution'
							type='string'
							placeholder='Hit Points Distribution'
							autoComplete='HitPointDistribution'
							value={this.state.HitPointDistribution || ''}
							name='HitPointDistribution'
							onChange={this.handleStringChange} />
						<Help id='HitPointDistribution' isColor='danger'>{this.state.HitPointDistributionError}</Help>
					</Control>
				</Field>
			</Tile>
		);
	}
}