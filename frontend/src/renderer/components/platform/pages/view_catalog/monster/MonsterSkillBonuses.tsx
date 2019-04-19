import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';

import { isDeepStrictEqual } from 'util';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, FormControl, InputLabel, Input, FormHelperText, Grid, Tooltip } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Help} from "bloomer";

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

	componentWillReceiveProps(nextProps: IMonsterSkillBonusesProps) {
		if (isDeepStrictEqual(this.props.initial, nextProps.initial) == false)
			this.setState({
				...nextProps.initial
			});
	}

	private keyNames: string[] = [
		'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight',
		'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance',
		'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival' ];

	private skillBonusesHints: {[id: string]: string;} = {
		'Acrobatics': "Dexterity (Acrobatics) covers your attempt to stay on your feet in a tricky situation, such as when you're trying to run across a sheet of ice, balance on a tightrope, or stay upright on a rocking ship's deck. It can also count to see if you can perform acrobatic stunts, including dives, rolls, somersaults, and flips.",
		'Animal Handling': "Wisdom (Animal Handling) covers whether you can calm down a domesticated animal, keep a mount from getting spooked, or intuit an animal's intentions.",
		'Arcana': "Intelligence (Arcana) measures your ability to recall lore about spells, magic items, eldritch symbols, magical traditions, the planes of existence, and the inhabitants of those planes.",
		'Athletics': "Strength (Athletics) covers difficult situations you encounter while climbing, jumping, or swimming.",
		'Deception': "Charisma (Deception) determines whether you can convincingly hide the truth, either verbally or through your actions.",
		'History': "Intelligence (History) measures your ability to recall lore about historical events, legendary people, ancient kingdoms, past disputes, recent wars, and lost civilizations.",
		'Insight': " Wisdom (Insight) decides whether you can determine the true intentions of a creature, such as when searching out a lie or predicting someone's next move.",
		'Intimidation': "Charisma (Intimidation) covers when you attempt to influence someone through overt threats, hostile actions, and physical violence.",
		'Investigation': "Intelligence (Investigation) covers when you look around for clues and make deductions based on those clues.",
		'Medicine': "Wisdom (Medicine) measures your ability to stabilize a dying companion or diagnose an illness.",
		'Nature': "Intelligence (Nature) measures your ability to recall lore about terrain, plants and animals, the weather, and natural cycles.",
		'Perception': "Wisdom (Perception) lets you spot, hear, or otherwise detect the presence of something.",
		'Performance': "Charisma (Performance) determines how well you can delight an audience with music, dance, acting, storytelling, or some other form of entertainment.",
		'Persuasion': "Charisma (Persuasion) covers when you attempt to influence someone or a group of people with tact, social graces, or good nature.",
		'Religion': "Intelligence (Religion) measures your ability to recall lore about deities, rites and prayers, religious hierarchies, holy symbols, and the practices of secret cults.",
		'Sleight of Hand': "Dexterity (Sleight of Hand) covers when you attempt an act of legerdemain or manual trickery, such as planting something on someone else, concealing an object on your person, or slipping something out of another person's pocket.",
		'Stealth': "Dexterity (Stealth) is when you attempt to conceal yourself from enemies, slink past guards, slip away without being noticed, or sneak up on someone without being seen or heard.",
		'Survival': "Wisdom (Survival) measures your ability to follow tracks, hunt wild game, guide your group through frozen wastelands, identify signs that owlbears live nearby, predict the weather, or avoid quicksand and other natural hazards.",
	}

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
			<ExpansionPanel defaultExpanded CollapseProps={{timeout: 100}} >
				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
					<Typography className='heading' >Skill Bonuses</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Grid container spacing={8} >
						{this.keyNames.map(skillName =>
							<Grid item xs={6} sm={4} key={skillName} >
								<FormControl className='formControl' fullWidth disabled={this.props.disabled} >
									<InputLabel htmlFor={skillName}>{skillName}</InputLabel>
									<Input
										id={skillName}
										type='number'
										value={this.state[skillName] != undefined ? this.state[skillName] : ''}
										name={skillName}
										onChange={this.handleMonsterSkillChange}
										aria-describedby={skillName+'-helper-text'} />
									<FormHelperText error id={skillName+'-helper-text'}>{this.state[skillName+'Error']}</FormHelperText>
									<Tooltip disableFocusListener title={this.skillBonusesHints[skillName]}>
										<Help>Hover for More About {skillName}</Help>
									</Tooltip>
								</FormControl>
							</Grid>
						)}
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}