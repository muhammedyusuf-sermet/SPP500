import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import { IMonsterSkillBonusesProps, IMonsterSkillBonusesState, MonsterSkillBonuses } from '../../src/renderer/components/platform/pages/view_catalog/monster/MonsterSkillBonuses';
const Joi = require('joi');
import { ValidationOptions } from 'joi';

const payloadSchema = Joi.object({
	Skills: Joi.object().pattern(
		Joi.symbol().valid([
			"Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight",
			"Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance",
			"Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival" ]),
		Joi.number().integer().greater(0).allow(0)
	).default({})
});
const validateOptions: ValidationOptions = {
	abortEarly: false,
	convert: true,
	allowUnknown: false,
	context: {

	}
};

////// Happy Path //////
describe('Monster SkillBonuses', () => {

	let monsterSkillBonusesInstance: ReactWrapper<IMonsterSkillBonusesProps, IMonsterSkillBonusesState, MonsterSkillBonuses>;

	describe('Provided Stat values', () => {

		beforeEach(() => {
			monsterSkillBonusesInstance =
				mount<MonsterSkillBonuses, IMonsterSkillBonusesProps, IMonsterSkillBonusesState>(
					<MonsterSkillBonuses
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{
							Athletics: 9,
							"Sleight of Hand": 2,
							"Animal Handling": 14,
							Acrobatics: 10,
							Stealth: 8,
							Arcana: 7,
							History: 7,
							Investigation: 6,
							Nature: 7,
							Religion: 8,
							Insight: 10,
							Medicine: 12,
							Perception: 15,
							Survival: 11,
							Deception: 10,
							Intimidation: 9,
							Performance: 7,
							Persuasion: 4,
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterSkillBonusesInstance).toBeDefined();
		});

		it('should have the correct number for Athletics', () => {
			expect(monsterSkillBonusesInstance.find('Input#Athletics').props().value).toEqual(9);
		});

		it('should have the correct number for Sleight of Hand', () => {
			expect(monsterSkillBonusesInstance.find('Input[id="Sleight of Hand"]').props().value).toEqual(2);
		});

		it('should have the correct number for Animal Handling', () => {
			expect(monsterSkillBonusesInstance.find('Input[id="Animal Handling"]').props().value).toEqual(14);
		});

		it('should have the correct number for Acrobatics', () => {
			expect(monsterSkillBonusesInstance.find('Input#Acrobatics').props().value).toEqual(10);
		});

		it('should have the correct number for Stealth', () => {
			expect(monsterSkillBonusesInstance.find('Input#Stealth').props().value).toEqual(8);
		});

		it('should have the correct number for Arcana', () => {
			expect(monsterSkillBonusesInstance.find('Input#Arcana').props().value).toEqual(7);
		});

		it('should have the correct number for History', () => {
			expect(monsterSkillBonusesInstance.find('Input#History').props().value).toEqual(7);
		});

		it('should have the correct number for Investigation', () => {
			expect(monsterSkillBonusesInstance.find('Input#Investigation').props().value).toEqual(6);
		});

		it('should have the correct number for Nature', () => {
			expect(monsterSkillBonusesInstance.find('Input#Nature').props().value).toEqual(7);
		});

		it('should have the correct number for Religion', () => {
			expect(monsterSkillBonusesInstance.find('Input#Religion').props().value).toEqual(8);
		});

		it('should have the correct number for Insight', () => {
			expect(monsterSkillBonusesInstance.find('Input#Insight').props().value).toEqual(10);
		});

		it('should have the correct number for Medicine', () => {
			expect(monsterSkillBonusesInstance.find('Input#Medicine').props().value).toEqual(12);
		});

		it('should have the correct number for Perception', () => {
			expect(monsterSkillBonusesInstance.find('Input#Perception').props().value).toEqual(15);
		});

		it('should have the correct number for Survival', () => {
			expect(monsterSkillBonusesInstance.find('Input#Survival').props().value).toEqual(11);
		});

		it('should have the correct number for Deception', () => {
			expect(monsterSkillBonusesInstance.find('Input#Deception').props().value).toEqual(10);
		});

		it('should have the correct number for Intimidation', () => {
			expect(monsterSkillBonusesInstance.find('Input#Intimidation').props().value).toEqual(9);
		});

		it('should have the correct number for Performance', () => {
			expect(monsterSkillBonusesInstance.find('Input#Performance').props().value).toEqual(7);
		});

		it('should have the correct number for Persuasion', () => {
			expect(monsterSkillBonusesInstance.find('Input#Persuasion').props().value).toEqual(4);
		});
	});

	describe('Happy Path', () => {

		beforeEach(() => {
			monsterSkillBonusesInstance =
				mount<MonsterSkillBonuses, IMonsterSkillBonusesProps, IMonsterSkillBonusesState>(
					<MonsterSkillBonuses
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterSkillBonusesInstance).toBeDefined();
		});

		it('should be able to update state', () => {
			monsterSkillBonusesInstance.find('Input#Athletics').simulate('change', { target: { value: 9 } })
			monsterSkillBonusesInstance.find('Input[id="Sleight of Hand"]').simulate('change', { target: { value: 2 } })
			monsterSkillBonusesInstance.find('Input[id="Animal Handling"]').simulate('change', { target: { value: 14 } })
			monsterSkillBonusesInstance.find('Input#Acrobatics').simulate('change', { target: { value: 10 } })
			monsterSkillBonusesInstance.find('Input#Stealth').simulate('change', { target: { value: 8 } })
			monsterSkillBonusesInstance.find('Input#Arcana').simulate('change', { target: { value: 7 } })
			monsterSkillBonusesInstance.find('Input#History').simulate('change', { target: { value: 7 } })
			monsterSkillBonusesInstance.find('Input#Investigation').simulate('change', { target: { value: 6 } })
			monsterSkillBonusesInstance.find('Input#Nature').simulate('change', { target: { value: 7 } })
			monsterSkillBonusesInstance.find('Input#Religion').simulate('change', { target: { value: 8 } })
			monsterSkillBonusesInstance.find('Input#Insight').simulate('change', { target: { value: 10 } })
			monsterSkillBonusesInstance.find('Input#Medicine').simulate('change', { target: { value: 12 } })
			monsterSkillBonusesInstance.find('Input#Perception').simulate('change', { target: { value: 15 } })
			monsterSkillBonusesInstance.find('Input#Survival').simulate('change', { target: { value: 11 } })
			monsterSkillBonusesInstance.find('Input#Deception').simulate('change', { target: { value: 10 } })
			monsterSkillBonusesInstance.find('Input#Intimidation').simulate('change', { target: { value: 9 } })
			monsterSkillBonusesInstance.find('Input#Performance').simulate('change', { target: { value: 7 } })
			monsterSkillBonusesInstance.find('Input#Persuasion').simulate('change', { target: { value: 4 } })
			expect(monsterSkillBonusesInstance.state()).toEqual({
				// data
				Athletics: 9,
				"Sleight of Hand": 2,
				"Animal Handling": 14,
				Acrobatics: 10,
				Stealth: 8,
				Arcana: 7,
				History: 7,
				Investigation: 6,
				Nature: 7,
				Religion: 8,
				Insight: 10,
				Medicine: 12,
				Perception: 15,
				Survival: 11,
				Deception: 10,
				Intimidation: 9,
				Performance: 7,
				Persuasion: 4,
				// errors
				AthleticsError: undefined,
				"Sleight of HandError": undefined,
				"Animal HandlingError": undefined,
				AcrobaticsError: undefined,
				StealthError: undefined,
				ArcanaError: undefined,
				HistoryError: undefined,
				InvestigationError: undefined,
				NatureError: undefined,
				ReligionError: undefined,
				InsightError: undefined,
				MedicineError: undefined,
				PerceptionError: undefined,
				SurvivalError: undefined,
				DeceptionError: undefined,
				IntimidationError: undefined,
				PerformanceError: undefined,
				PersuasionError: undefined,
			});
		});
		// STATE CHANGE
		it('should change only Athletics when Athletics is changed', () => {
			monsterSkillBonusesInstance.find('Input#Athletics').simulate('change', { target: { value: '9' } })
			expect(monsterSkillBonusesInstance.state().Athletics).toEqual(9);
		})

		it('should change only Sleight of Hand when Sleight of Hand is changed', () => {
			monsterSkillBonusesInstance.find('Input[id="Sleight of Hand"]').simulate('change', { target: { value: '2' } })
			expect(monsterSkillBonusesInstance.state()['Sleight of Hand']).toEqual(2);
		})

		it('should change only Animal Handling when Animal Handling is changed', () => {
			monsterSkillBonusesInstance.find('Input[id="Animal Handling"]').simulate('change', { target: { value: '14' } })
			expect(monsterSkillBonusesInstance.state()['Animal Handling']).toEqual(14);
		})

		it('should change only Acrobatics when Acrobatics is changed', () => {
			monsterSkillBonusesInstance.find('Input#Acrobatics').simulate('change', { target: { value: '10' } })
			expect(monsterSkillBonusesInstance.state().Acrobatics).toEqual(10);
		})

		it('should change only Stealth when Stealth is changed', () => {
			monsterSkillBonusesInstance.find('Input#Stealth').simulate('change', { target: { value: '8' } })
			expect(monsterSkillBonusesInstance.state().Stealth).toEqual(8);
		})

		it('should change only Arcana when Arcana is changed', () => {
			monsterSkillBonusesInstance.find('Input#Arcana').simulate('change', { target: { value: '7' } })
			expect(monsterSkillBonusesInstance.state().Arcana).toEqual(7);
		})

		it('should change only History when History is changed', () => {
			monsterSkillBonusesInstance.find('Input#History').simulate('change', { target: { value: '7' } })
			expect(monsterSkillBonusesInstance.state().History).toEqual(7);
		})

		it('should change only Investigation when Investigation is changed', () => {
			monsterSkillBonusesInstance.find('Input#Investigation').simulate('change', { target: { value: '6' } })
			expect(monsterSkillBonusesInstance.state().Investigation).toEqual(6);
		})

		it('should change only Nature when Nature is changed', () => {
			monsterSkillBonusesInstance.find('Input#Nature').simulate('change', { target: { value: '7' } })
			expect(monsterSkillBonusesInstance.state().Nature).toEqual(7);
		})

		it('should change only Religion when Religion is changed', () => {
			monsterSkillBonusesInstance.find('Input#Religion').simulate('change', { target: { value: '8' } })
			expect(monsterSkillBonusesInstance.state().Religion).toEqual(8);
		})

		it('should change only Insight when Insight is changed', () => {
			monsterSkillBonusesInstance.find('Input#Insight').simulate('change', { target: { value: '10' } })
			expect(monsterSkillBonusesInstance.state().Insight).toEqual(10);
		})

		it('should change only Medicine when Medicine is changed', () => {
			monsterSkillBonusesInstance.find('Input#Medicine').simulate('change', { target: { value: '12' } })
			expect(monsterSkillBonusesInstance.state().Medicine).toEqual(12);
		})

		it('should change only Perception when Perception is changed', () => {
			monsterSkillBonusesInstance.find('Input#Perception').simulate('change', { target: { value: '15' } })
			expect(monsterSkillBonusesInstance.state().Perception).toEqual(15);
		})

		it('should change only Survival when Survival is changed', () => {
			monsterSkillBonusesInstance.find('Input#Survival').simulate('change', { target: { value: '11' } })
			expect(monsterSkillBonusesInstance.state().Survival).toEqual(11);
		})

		it('should change only Deception when Deception is changed', () => {
			monsterSkillBonusesInstance.find('Input#Deception').simulate('change', { target: { value: '10' } })
			expect(monsterSkillBonusesInstance.state().Deception).toEqual(10);
		})

		it('should change only Intimidation when Intimidation is changed', () => {
			monsterSkillBonusesInstance.find('Input#Intimidation').simulate('change', { target: { value: '9' } })
			expect(monsterSkillBonusesInstance.state().Intimidation).toEqual(9);
		})

		it('should change only Performance when Performance is changed', () => {
			monsterSkillBonusesInstance.find('Input#Performance').simulate('change', { target: { value: '7' } })
			expect(monsterSkillBonusesInstance.state().Performance).toEqual(7);
		})

		it('should change only Persuasion when Persuasion is changed', () => {
			monsterSkillBonusesInstance.find('Input#Persuasion').simulate('change', { target: { value: '4' } })
			expect(monsterSkillBonusesInstance.state().Persuasion).toEqual(4);
		})
		// DEFAULTS
		it('should change Athletics back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input#Athletics').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Athletics).toEqual(undefined);
		})

		it('should change Sleight of Hand back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input[id="Sleight of Hand"]').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state()['Sleight of Hand']).toEqual(undefined);
		})

		it('should change Animal Handling back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input[id="Animal Handling"]').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state()['Animal Handling']).toEqual(undefined);
		})

		it('should change Acrobatics back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input#Acrobatics').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Acrobatics).toEqual(undefined);
		})

		it('should change Stealth back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input#Stealth').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Stealth).toEqual(undefined);
		})

		it('should change Arcana back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input#Arcana').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Arcana).toEqual(undefined);
		})

		it('should change History back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input#History').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().History).toEqual(undefined);
		})

		it('should change Investigation back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input#Investigation').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Investigation).toEqual(undefined);
		})

		it('should change Nature back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input#Nature').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Nature).toEqual(undefined);
		})

		it('should change Religion back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input#Religion').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Religion).toEqual(undefined);
		})

		it('should change Insight back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input#Insight').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Insight).toEqual(undefined);
		})

		it('should change Medicine back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input#Medicine').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Medicine).toEqual(undefined);
		})

		it('should change Perception back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input#Perception').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Perception).toEqual(undefined);
		})

		it('should change Survival back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input#Survival').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Survival).toEqual(undefined);
		})

		it('should change Deception back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input#Deception').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Deception).toEqual(undefined);
		})

		it('should change Intimidation back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input#Intimidation').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Intimidation).toEqual(undefined);
		})

		it('should change Performance back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input#Performance').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Performance).toEqual(undefined);
		})

		it('should change Persuasion back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('Input#Persuasion').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Persuasion).toEqual(undefined);
		})

		// VALIDATION
		it('should validate Athletics when Athletics is changed', () => {
			monsterSkillBonusesInstance.find('Input#Athletics').simulate('change', { target: { value: '-12'  } })
			expect(monsterSkillBonusesInstance.state().Athletics).toEqual(-12);
			expect(monsterSkillBonusesInstance.find('Help#Athletics').text()).toEqual('\"Athletics\" must be greater than 0');
		})

		it('should validate Sleight of Hand when Sleight of Hand is changed', () => {
			monsterSkillBonusesInstance.find('Input[id="Sleight of Hand"]').simulate('change', { target: { value: '-16'  } })
			expect(monsterSkillBonusesInstance.state()["Sleight of Hand"]).toEqual(-16);
			expect(monsterSkillBonusesInstance.find('Help[id="Sleight of Hand"]').text()).toEqual('\"Sleight of Hand\" must be greater than 0');
		})

		it('should validate Animal Handling when Animal Handling is changed', () => {
			monsterSkillBonusesInstance.find('Input[id="Animal Handling"]').simulate('change', { target: { value: '-6'  } })
			expect(monsterSkillBonusesInstance.state()["Animal Handling"]).toEqual(-6);
			expect(monsterSkillBonusesInstance.find('Help[id="Animal Handling"]').text()).toEqual('\"Animal Handling\" must be greater than 0');
		})

		it('should validate Acrobatics when Acrobatics is changed', () => {
			monsterSkillBonusesInstance.find('Input#Acrobatics').simulate('change', { target: { value: '-102'  } })
			expect(monsterSkillBonusesInstance.state().Acrobatics).toEqual(-102);
			expect(monsterSkillBonusesInstance.find('Help#Acrobatics').text()).toEqual('\"Acrobatics\" must be greater than 0');
		})

		it('should validate Stealth when Stealth is changed', () => {
			monsterSkillBonusesInstance.find('Input#Stealth').simulate('change', { target: { value: '-1'  } })
			expect(monsterSkillBonusesInstance.state().Stealth).toEqual(-1);
			expect(monsterSkillBonusesInstance.find('Help#Stealth').text()).toEqual('\"Stealth\" must be greater than 0');
		})

		it('should validate Arcana when Arcana is changed', () => {
			monsterSkillBonusesInstance.find('Input#Arcana').simulate('change', { target: { value: '-9'  } })
			expect(monsterSkillBonusesInstance.state().Arcana).toEqual(-9);
			expect(monsterSkillBonusesInstance.find('Help#Arcana').text()).toEqual('\"Arcana\" must be greater than 0');
		})

		it('should validate History when History is changed', () => {
			monsterSkillBonusesInstance.find('Input#History').simulate('change', { target: { value: '-12'  } })
			expect(monsterSkillBonusesInstance.state().History).toEqual(-12);
			expect(monsterSkillBonusesInstance.find('Help#History').text()).toEqual('\"History\" must be greater than 0');
		})

		it('should validate Investigation when Investigation is changed', () => {
			monsterSkillBonusesInstance.find('Input#Investigation').simulate('change', { target: { value: '-16'  } })
			expect(monsterSkillBonusesInstance.state().Investigation).toEqual(-16);
			expect(monsterSkillBonusesInstance.find('Help#Investigation').text()).toEqual('\"Investigation\" must be greater than 0');
		})

		it('should validate Nature when Nature is changed', () => {
			monsterSkillBonusesInstance.find('Input#Nature').simulate('change', { target: { value: '-6'  } })
			expect(monsterSkillBonusesInstance.state().Nature).toEqual(-6);
			expect(monsterSkillBonusesInstance.find('Help#Nature').text()).toEqual('\"Nature\" must be greater than 0');
		})

		it('should validate Religion when Religion is changed', () => {
			monsterSkillBonusesInstance.find('Input#Religion').simulate('change', { target: { value: '-102'  } })
			expect(monsterSkillBonusesInstance.state().Religion).toEqual(-102);
			expect(monsterSkillBonusesInstance.find('Help#Religion').text()).toEqual('\"Religion\" must be greater than 0');
		})

		it('should validate Insight when Insight is changed', () => {
			monsterSkillBonusesInstance.find('Input#Insight').simulate('change', { target: { value: '-1'  } })
			expect(monsterSkillBonusesInstance.state().Insight).toEqual(-1);
			expect(monsterSkillBonusesInstance.find('Help#Insight').text()).toEqual('\"Insight\" must be greater than 0');
		})

		it('should validate Medicine when Medicine is changed', () => {
			monsterSkillBonusesInstance.find('Input#Medicine').simulate('change', { target: { value: '-9'  } })
			expect(monsterSkillBonusesInstance.state().Medicine).toEqual(-9);
			expect(monsterSkillBonusesInstance.find('Help#Medicine').text()).toEqual('\"Medicine\" must be greater than 0');
		})

		it('should validate Perception when Perception is changed', () => {
			monsterSkillBonusesInstance.find('Input#Perception').simulate('change', { target: { value: '-12'  } })
			expect(monsterSkillBonusesInstance.state().Perception).toEqual(-12);
			expect(monsterSkillBonusesInstance.find('Help#Perception').text()).toEqual('\"Perception\" must be greater than 0');
		})

		it('should validate Survival when Survival is changed', () => {
			monsterSkillBonusesInstance.find('Input#Survival').simulate('change', { target: { value: '-16'  } })
			expect(monsterSkillBonusesInstance.state().Survival).toEqual(-16);
			expect(monsterSkillBonusesInstance.find('Help#Survival').text()).toEqual('\"Survival\" must be greater than 0');
		})

		it('should validate Deception when Deception is changed', () => {
			monsterSkillBonusesInstance.find('Input#Deception').simulate('change', { target: { value: '-6'  } })
			expect(monsterSkillBonusesInstance.state().Deception).toEqual(-6);
			expect(monsterSkillBonusesInstance.find('Help#Deception').text()).toEqual('\"Deception\" must be greater than 0');
		})

		it('should validate Intimidation when Intimidation is changed', () => {
			monsterSkillBonusesInstance.find('Input#Intimidation').simulate('change', { target: { value: '-102'  } })
			expect(monsterSkillBonusesInstance.state().Intimidation).toEqual(-102);
			expect(monsterSkillBonusesInstance.find('Help#Intimidation').text()).toEqual('\"Intimidation\" must be greater than 0');
		})

		it('should validate Performance when Performance is changed', () => {
			monsterSkillBonusesInstance.find('Input#Performance').simulate('change', { target: { value: '-1'  } })
			expect(monsterSkillBonusesInstance.state().Performance).toEqual(-1);
			expect(monsterSkillBonusesInstance.find('Help#Performance').text()).toEqual('\"Performance\" must be greater than 0');
		})

		it('should validate Persuasion when Persuasion is changed', () => {
			monsterSkillBonusesInstance.find('Input#Persuasion').simulate('change', { target: { value: '-9'  } })
			expect(monsterSkillBonusesInstance.state().Persuasion).toEqual(-9);
			expect(monsterSkillBonusesInstance.find('Help#Persuasion').text()).toEqual('\"Persuasion\" must be greater than 0');
		})
	});
});