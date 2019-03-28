import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';
import { Tile, Subtitle, Field, FieldLabel, Label, FieldBody, Control, Input, Help } from 'bloomer';

export interface IMonsterStatsProps {
	disabled?: boolean,
	// validation
	PayloadSchema: JoiObject,
	ValidationOptions: ValidationOptions,
	// parent
	Parent: string,
	// initial values
	Strength?: number;
	Dexterity?: number;
	Constitution?: number;
	Intelligence?: number;
	Wisdom?: number;
	Charisma?: number;
}

export interface IMonsterStatsState {
	[key: string]: number | string | undefined;
	// data
	Strength?: number;
	Dexterity?: number;
	Constitution?: number;
	Intelligence?: number;
	Wisdom?: number;
	Charisma?: number;
	// errors
	StrengthError?: string;
	DexterityError?: string;
	ConstitutionError?: string;
	IntelligenceError?: string;
	WisdomError?: string;
	CharismaError?: string;
}

export class MonsterStats extends React.Component<IMonsterStatsProps, IMonsterStatsState> {
	constructor(props: IMonsterStatsProps) {
		super(props);
		this.state = {
			Strength: props.Strength,
			Dexterity: props.Dexterity,
			Constitution: props.Constitution,
			Intelligence: props.Intelligence,
			Wisdom: props.Wisdom,
			Charisma: props.Charisma
		};
	}

	private keyNames = [ "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma" ];

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	handleMonsterNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = this.stringToNumber(event.target.value);
		const name = event.currentTarget.name;
		Joi.validate(
			value,
			Joi.reach(this.props.PayloadSchema, [this.props.Parent, name]),
			this.props.ValidationOptions,
			(errors: ValidationError) => {
				this.setState({
					[name]: value,
					[name+'Error']: errors ? errors.details[0].message : undefined
				});
			});
		}

	render() {
		return (
			<Tile className="box" isVertical isParent >
				<Tile isChild render={ (props: any) =>
					<React.Fragment>
						<Subtitle>{this.props.Parent.replace(/([A-Z])/g, ' $1').trim()}</Subtitle>
						{this.keyNames.map((value: string) =>
							<Field isHorizontal key={this.props.Parent+value}>
								<FieldLabel isNormal>
									<Label>{value}</Label>
								</FieldLabel>
								<FieldBody>
									<Field>
										<Control>
											<Input
												disabled={this.props.disabled}
												id={this.props.Parent+value}
												type='number'
												placeholder={value}
												autoComplete={value}
												value={this.state[value] != undefined ? this.state[value] : ''}
												name={value}
												onChange={this.handleMonsterNumberChange} />
										</Control>
										<Help isColor='danger' id={this.props.Parent+value}>{this.state[value+'Error']}</Help>
									</Field>
								</FieldBody>
							</Field>
						)}
					</React.Fragment>
				} />
			</Tile>
		);
	}
}