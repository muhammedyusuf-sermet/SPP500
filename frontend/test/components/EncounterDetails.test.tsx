import * as React from "react"
import { shallow, ShallowWrapper } from 'enzyme';
import {EncounterDetails, IEncounterDetailsState} from '../../src/renderer/components/platform/pages/view_game_components/EncounterDetails';
import * as Encounter from '../../src/encounter';
import * as Monster from "../../src/monster";

describe('Test the Encounter View Details Per Encounter', () => {
	let encounterDetailsInstance: ShallowWrapper<any, IEncounterDetailsState, EncounterDetails>;

	beforeEach(() => {
		let encounterExample: Encounter.IEncounterState;
		encounterExample = {
			Id: "",
			Name: "Encounter",
			Description: "This is a fierce encounter...",
			Monsters: [] as Monster.IMonsterState[],
		};
		encounterDetailsInstance = shallow(<EncounterDetails encounter={encounterExample}/>);
	})

	it('renders without crashing', () => {
		expect(encounterDetailsInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(encounterDetailsInstance).toMatchSnapshot();
	});

	it('should return true if the IEncounterState object is empty', () => {
		let selectedEncounter: Encounter.IEncounterState;
		selectedEncounter = {} as Encounter.IEncounterState;
		let isEmpty = encounterDetailsInstance.instance().isEmptyObject(selectedEncounter);

		expect(isEmpty).toEqual(true);
	});

});
