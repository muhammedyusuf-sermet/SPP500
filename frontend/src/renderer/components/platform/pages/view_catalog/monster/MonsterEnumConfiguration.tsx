import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';

import { Select, Tile, Field, Control, Subtitle, Label, Help } from 'bloomer';
import { MonsterType, MonsterRace, Size, Environment, Alignment } from '../../../../../../monster';

const types = Object.values(MonsterType);
const sizes = Object.values(Size);
const races = Object.values(MonsterRace);
const environments = Object.values(Environment);
const alignments = Object.values(Alignment);

export interface IMonsterDropdownProps {
	disabled?: boolean,
	name: string,
	selected?: string,
	options: string[]
	onChange: (name: string, selectOption?: string) => void
}

export interface IMonsterDropdownState {
	selected: string
}

export class MonsterDropdown extends React.Component<IMonsterDropdownProps, IMonsterDropdownState> {
	constructor(props: IMonsterDropdownProps) {
		super(props);
		this.state = {
			selected: props.selected ? props.selected : 'Default'
		};
	}

	handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		this.setState({selected: event.target.value});
		if(event.target.value == 'Default'){
			this.props.onChange(this.props.name, undefined);
		}else{
			this.props.onChange(this.props.name, event.target.value);
		}
	}

	render() {
		return (
			<Select disabled={this.props.disabled} id={this.props.name} onChange={this.handleChange} value={this.state.selected} className="is-fullwidth">
				<option
					id={this.props.name+'.'+'Default'}
					value={'Default'}>
					{'Default'}
				</option>
				{this.props.options.map(option =>
					<option
						key={this.props.name+'.'+option}
						id={this.props.name+'.'+option}
						value={option}>
						{option.replace(/([A-Z])/g, ' $1').trim()}
					</option>)}
			</Select>
		);
	}
}

export interface IMonsterEnumConfigurationProps {
	disabled?: boolean,
	// validation
	PayloadSchema: JoiObject,
	ValidationOptions: ValidationOptions,
	// initial values
	Size?: string;
	Type?: string;
	Race?: string;
	Alignment?: string;
	Environment?: string;
}

export interface IMonsterEnumConfigurationState {
	// data
	Size?: string;
	Type?: string;
	Race?: string;
	Alignment?: string;
	Environment?: string;
	// errors
	SizeError?: string;
	TypeError?: string;
	RaceError?: string;
	AlignmentError?: string;
	EnvironmentError?: string;
}

export class MonsterEnumConfiguration extends React.Component<IMonsterEnumConfigurationProps, IMonsterEnumConfigurationState> {
	constructor(props: IMonsterEnumConfigurationProps) {
		super(props);
		this.state = {};
		Object.assign(this.state, props);
	}

	handleMonsterEnumChange = (name: string, newEnum?: string) => {
		if (newEnum) {
			Joi.validate(
				newEnum,
				Joi.reach(this.props.PayloadSchema, [name]),
				this.props.ValidationOptions,
				(errors: ValidationError) => {
					this.setState({
						[name]: newEnum,
						[name+'Error']: errors ? errors.details[0].message : undefined
					});
				});
		} else {
			this.setState({
				[name]: undefined,
				[name+'Error']: undefined
			});
		}
	}

	render() {
		return (
			<Tile className="box" isVertical>
				<Subtitle>Basic Configurations</Subtitle>
				<Field isGrouped='centered' isHorizontal>
					<Control isExpanded>
						<Label>Type</Label>
						<MonsterDropdown disabled={this.props.disabled} selected={this.state.Type} name='Type' options={types} onChange={this.handleMonsterEnumChange} />
						<Help isColor='danger'>{this.state.TypeError}</Help>
					</Control>
					<Control isExpanded>
						<Label>Size</Label>
						<MonsterDropdown disabled={this.props.disabled} selected={this.state.Size} name='Size' options={sizes} onChange={this.handleMonsterEnumChange} />
						<Help isColor='danger'>{this.state.SizeError}</Help>
					</Control>
					<Control isExpanded>
						<Label>Race</Label>
						<MonsterDropdown disabled={this.props.disabled} selected={this.state.Race} name='Race' options={races} onChange={this.handleMonsterEnumChange} />
						<Help isColor='danger'>{this.state.RaceError}</Help>
					</Control>
				</Field>
				<Field isGrouped='centered' isHorizontal>
					<Control isExpanded>
						<Label>Alignment</Label>
						<MonsterDropdown disabled={this.props.disabled} selected={this.state.Alignment} name='Alignment' options={alignments} onChange={this.handleMonsterEnumChange} />
						<Help isColor='danger'>{this.state.AlignmentError}</Help>
					</Control>
					<Control isExpanded>
						<Label>Environment</Label>
						<MonsterDropdown disabled={this.props.disabled} selected={this.state.Environment} name='Environment' options={environments} onChange={this.handleMonsterEnumChange} />
						<Help isColor='danger'>{this.state.EnvironmentError}</Help>
					</Control>
				</Field>
			</Tile>
		);
	}
}