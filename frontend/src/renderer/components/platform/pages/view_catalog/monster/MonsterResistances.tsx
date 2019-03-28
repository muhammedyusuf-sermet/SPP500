import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';
import { Tile, Subtitle, Field, FieldLabel, Label, FieldBody, Control, Input, Help } from 'bloomer';

export interface IMonsterResistancesProps {
	disabled?: boolean,
	// validation
	PayloadSchema: JoiObject,
	ValidationOptions: ValidationOptions,
	// initial values
	initial: {
		DamageVulnerabilities?: string;
		DamageResistances?: string;
		DamageImmunities?: string;
		ConditionImmunities?: string;
	}
}

export interface IMonsterResistancesState {
	// data
	DamageVulnerabilities?: string;
	DamageResistances?: string;
	DamageImmunities?: string;
	ConditionImmunities?: string;
	// errors
	DamageVulnerabilitiesError?: string;
	DamageResistancesError?: string;
	DamageImmunitiesError?: string;
	ConditionImmunitiesError?: string;
}

export class MonsterResistances extends React.Component<IMonsterResistancesProps, IMonsterResistancesState> {
	constructor(props: IMonsterResistancesProps) {
		super(props);
		this.state = {
			...props.initial
		};
	}

	handleResistancesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
				<Subtitle>Vulnerability, Resistance, and Immunity</Subtitle>
				<Field isHorizontal>
					<FieldLabel isNormal>
						<Label>Damage Vulnerabilities </Label>
					</FieldLabel>
					<FieldBody>
						<Field>
							<Control>
								<Input
									disabled={this.props.disabled}
									id='DamageVulnerabilities'
									type='text'
									placeholder='Damage Vulnerabilities'
									autoComplete='DamageVulnerabilities'
									value={this.state.DamageVulnerabilities || ''}
									name='DamageVulnerabilities'
									onChange={this.handleResistancesChange} />
							</Control>
							<Help id='DamageVulnerabilities' isColor='danger'>{this.state.DamageVulnerabilitiesError}</Help>
						</Field>
					</FieldBody>
				</Field>
				<Field isHorizontal>
					<FieldLabel isNormal>
						<Label>Damage Resistances </Label>
					</FieldLabel>
					<FieldBody>
						<Field>
							<Control>
								<Input
									disabled={this.props.disabled}
									id='DamageResistances'
									type='text'
									placeholder='Damage Resistances'
									autoComplete='DamageResistances'
									value={this.state.DamageResistances || ''}
									name='DamageResistances'
									onChange={this.handleResistancesChange} />
							</Control>
							<Help id='DamageResistances' isColor='danger'>{this.state.DamageResistancesError}</Help>
						</Field>
					</FieldBody>
				</Field>
				<Field isHorizontal>
					<FieldLabel isNormal>
						<Label>Damage Immunities </Label>
					</FieldLabel>
					<FieldBody>
						<Field>
							<Control>
								<Input
									disabled={this.props.disabled}
									id='DamageImmunities'
									type='text'
									placeholder='Damage Immunities'
									autoComplete='DamageImmunities'
									value={this.state.DamageImmunities || ''}
									name='DamageImmunities'
									onChange={this.handleResistancesChange} />
							</Control>
							<Help id='DamageImmunities' isColor='danger'>{this.state.DamageImmunitiesError}</Help>
						</Field>
					</FieldBody>
				</Field>
				<Field isHorizontal>
					<FieldLabel isNormal>
						<Label>Condition Immunities </Label>
					</FieldLabel>
					<FieldBody>
						<Field>
							<Control>
								<Input
									disabled={this.props.disabled}
									id='ConditionImmunities'
									type='text'
									placeholder='Condition Immunities'
									autoComplete='ConditionImmunities'
									value={this.state.ConditionImmunities || ''}
									name='ConditionImmunities'
									onChange={this.handleResistancesChange} />
							</Control>
							<Help id='ConditionImmunities' isColor='danger'>{this.state.ConditionImmunitiesError}</Help>
						</Field>
					</FieldBody>
				</Field>
			</Tile>
		);
	}
}