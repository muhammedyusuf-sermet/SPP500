import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';
import { Tile, Subtitle, Field, FieldLabel, Label, FieldBody, Control, Input, Help, Column, Columns } from 'bloomer';
import { isDeepStrictEqual } from 'util';

export interface IMonsterSenseBonusesProps {
	disabled?: boolean;
	// validation
	PayloadSchema: JoiObject;
	ValidationOptions: ValidationOptions;
	// initial values
	initial: {
		[senseName: string]: number | undefined;
	}
}

export interface IMonsterSenseBonusesState {
	[key: string]: number | string | undefined;
}

export class MonsterSenseBonuses extends React.Component<IMonsterSenseBonusesProps, IMonsterSenseBonusesState> {
	constructor(props: IMonsterSenseBonusesProps) {
		super(props);
		this.state = {
			...props.initial
		};
	}

	componentWillReceiveProps(nextProps: IMonsterSenseBonusesProps) {
		if (isDeepStrictEqual(this.props.initial, nextProps.initial) == false)
			this.setState({
				...nextProps.initial
			});
	}

	private keyNames: string[] = [
		"Blind", "Blindsight", "Darkvision", "Tremorsense", "Truesight",
		"Passive Perception", "Passive Investigation", "Passive Insight" ];

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	handleMonsterSenseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = this.stringToNumber(event.target.value);
		const name = event.currentTarget.name;
		Joi.validate(
			{ [name]: value },
			Joi.reach(this.props.PayloadSchema, ['Senses']),
			this.props.ValidationOptions,
			(errors: ValidationError) => {
				this.setState({
					[name]: value,
					[name+'Error']: errors ? errors.details[0].message : undefined
				});
			});
		};

	render() {
		return (
			<Tile className="box" isVertical>
				<Subtitle>Sense Bonuses</Subtitle>
				<Columns isCentered>
					<Column className="box" isSize={4}>
						<Tile isChild render={ (props: any) =>
							<React.Fragment>
								{this.keyNames.slice(0,Math.round(this.keyNames.length*(1/3))).map(senseName =>
									<Field isHorizontal key={senseName}>
										<FieldLabel isNormal>
											<Label>{senseName}</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														disabled={this.props.disabled}
														id={senseName}
														type='number'
														placeholder={senseName}
														autoComplete={senseName}
														value={this.state[senseName] != undefined ? this.state[senseName] : ''}
														name={senseName}
														onChange={this.handleMonsterSenseChange} />
												</Control>
												<Help id={senseName} isColor='danger'>{this.state[senseName+'Error']}</Help>
											</Field>
										</FieldBody>
									</Field>
								)}
							</React.Fragment>
							} />
					</Column>
					<Column className='box' isSize={4}>
						<Tile isChild render={ (props: any) =>
							<React.Fragment>
								{this.keyNames.slice(Math.round(this.keyNames.length*(1/3)),Math.round(this.keyNames.length*(2/3))).map(senseName =>
									<Field isHorizontal key={senseName}>
										<FieldLabel isNormal>
											<Label>{senseName}</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														disabled={this.props.disabled}
														id={senseName}
														type='number'
														placeholder={senseName}
														autoComplete={senseName}
														value={this.state[senseName] != undefined ? this.state[senseName] : ''}
														name={senseName}
														onChange={this.handleMonsterSenseChange} />
												</Control>
												<Help id={senseName} isColor='danger'>{this.state[senseName+'Error']}</Help>
											</Field>
										</FieldBody>
									</Field>
								)}
							</React.Fragment>
							} />
					</Column>
					<Column className="box" isSize={4}>
						<Tile isChild render={ (props: any) =>
							<React.Fragment>
								{this.keyNames.slice(Math.round(this.keyNames.length*(2/3))).map(senseName =>
									<Field isHorizontal key={senseName}>
										<FieldLabel isNormal>
											<Label>{senseName}</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														disabled={this.props.disabled}
														id={senseName}
														type='number'
														placeholder={senseName}
														autoComplete={senseName}
														value={this.state[senseName] != undefined ? this.state[senseName] : ''}
														name={senseName}
														onChange={this.handleMonsterSenseChange} />
												</Control>
												<Help id={senseName} isColor='danger'>{this.state[senseName+'Error']}</Help>
											</Field>
										</FieldBody>
									</Field>
								)}
							</React.Fragment>
							} />
					</Column>
					<div/>
				</Columns>
			</Tile>
		);
	}
}