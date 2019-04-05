import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';
import { Field, FieldLabel, Label, FieldBody, Control, Input, Help } from 'bloomer';
import { isDeepStrictEqual } from 'util';

export interface IMonsterLanguagesProps {
	disabled?: boolean,
	// validation
	PayloadSchema: JoiObject,
	ValidationOptions: ValidationOptions,
	// initial values
	initial: {
		Languages?: string;
	}
}

export interface IMonsterLanguagesState {
	// data
	Languages?: string;
	// errors
	LanguagesError?: string;
}

export class MonsterLanguages extends React.Component<IMonsterLanguagesProps, IMonsterLanguagesState> {
	constructor(props: IMonsterLanguagesProps) {
		super(props);
		this.state = {
			...props.initial
		};
	}

	componentWillReceiveProps(nextProps: IMonsterLanguagesProps) {
		if (isDeepStrictEqual(this.props.initial, nextProps.initial) == false)
			this.setState({
				...nextProps.initial
			});
	}

	handleLanguagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
			<Field isHorizontal>
				<FieldLabel isNormal>
					<Label>Languages</Label>
				</FieldLabel>
				<FieldBody>
					<Field>
						<Control>
							<Input
								disabled={this.props.disabled}
								id='Languages'
								type='text'
								placeholder='Languages'
								autoComplete='Languages'
								value={this.state.Languages || ''}
								name='Languages'
								onChange={this.handleLanguagesChange} />
						</Control>
						<Help id='Languages' isColor='danger'>{this.state.LanguagesError}</Help>
					</Field>
				</FieldBody>
			</Field>
		);
	}
}