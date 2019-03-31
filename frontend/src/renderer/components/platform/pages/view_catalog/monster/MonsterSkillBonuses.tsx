import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';
import { Tile, Subtitle, Field, FieldLabel, Label, FieldBody, Control, Input, Help, Column, Columns } from 'bloomer';

export interface IMonsterSkillBonusesProps {
	disabled?: boolean;
	// validation
	PayloadSchema: JoiObject;
	ValidationOptions: ValidationOptions;
	// initial values
	initial: {
		[skillName: string]: number | undefined;
	}
}

export interface IMonsterSkillBonusesState {
	[key: string]: number | string | undefined;
}

export class MonsterSkillBonuses extends React.Component<IMonsterSkillBonusesProps, IMonsterSkillBonusesState> {
	constructor(props: IMonsterSkillBonusesProps) {
		super(props);
		this.state = {
			...props.initial
		};
	}

	private keyNames: string[] = [
		"Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight",
		"Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance",
		"Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival" ];

	stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
	}

	handleMonsterSkillChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = this.stringToNumber(event.target.value);
		const name = event.currentTarget.name;
		Joi.validate(
			{ [name]: value },
			Joi.reach(this.props.PayloadSchema, ['Skills']),
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
				<Subtitle>Skill Bonuses</Subtitle>
				<Columns isCentered>
					<Column className="box" isSize={4}>
						<Tile isChild render={ (props: any) =>
							<React.Fragment>
								{this.keyNames.slice(0,Math.round(this.keyNames.length*(1/3))).map(skillName =>
									<Field isHorizontal key={skillName}>
										<FieldLabel isNormal>
											<Label>{skillName}</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														disabled={this.props.disabled}
														id={skillName}
														type='number'
														placeholder={skillName}
														autoComplete={skillName}
														value={this.state[skillName] != undefined ? this.state[skillName] : ''}
														name={skillName}
														onChange={this.handleMonsterSkillChange} />
												</Control>
												<Help id={skillName} isColor='danger'>{this.state[skillName+'Error']}</Help>
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
								{this.keyNames.slice(Math.round(this.keyNames.length*(1/3)),Math.round(this.keyNames.length*(2/3))).map(skillName =>
									<Field isHorizontal key={skillName}>
										<FieldLabel isNormal>
											<Label>{skillName}</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														disabled={this.props.disabled}
														id={skillName}
														type='number'
														placeholder={skillName}
														autoComplete={skillName}
														value={this.state[skillName] != undefined ? this.state[skillName] : ''}
														name={skillName}
														onChange={this.handleMonsterSkillChange} />
												</Control>
												<Help id={skillName} isColor='danger'>{this.state[skillName+'Error']}</Help>
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
								{this.keyNames.slice(Math.round(this.keyNames.length*(2/3))).map(skillName =>
									<Field isHorizontal key={skillName}>
										<FieldLabel isNormal>
											<Label>{skillName}</Label>
										</FieldLabel>
										<FieldBody>
											<Field>
												<Control>
													<Input
														disabled={this.props.disabled}
														id={skillName}
														type='number'
														placeholder={skillName}
														autoComplete={skillName}
														value={this.state[skillName] != undefined ? this.state[skillName] : ''}
														name={skillName}
														onChange={this.handleMonsterSkillChange} />
												</Control>
												<Help id={skillName} isColor='danger'>{this.state[skillName+'Error']}</Help>
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