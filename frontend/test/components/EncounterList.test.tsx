import * as React from "react"
import { shallow, ShallowWrapper } from 'enzyme';
import {EncounterList, IEncounterListState} from '../../src/renderer/components/platform/pages/view_game_components/EncounterList';
import * as EncounterInterface from '../../src/encounter';

describe('Test the EncounterList View Details', () => {
	let encounterListInstance: ShallowWrapper<any, IEncounterListState, EncounterList>;

	beforeEach(() => {
		encounterListInstance = shallow(<EncounterList/>);
	})

	it('renders without crashing', () => {
		expect(encounterListInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(encounterListInstance).toMatchSnapshot();
	});

	it('should update the state variables when View button is clicked for a encounter', () => {
		let selectedEncounter: EncounterInterface.IEncounterState;
		selectedEncounter = {} as EncounterInterface.IEncounterState;
		encounterListInstance.instance().view(selectedEncounter);

		expect(encounterListInstance.state('viewEncounter')).toEqual(true);
		expect(encounterListInstance.state('selectedEncounter')).toEqual(selectedEncounter);
	});

	it('should update the state variables when Edit button is clicked for a encounter', () => {
		let selectedEncounter: EncounterInterface.IEncounterState;
		selectedEncounter = {} as EncounterInterface.IEncounterState;
		encounterListInstance.instance().edit(selectedEncounter);

		expect(encounterListInstance.state('editEncounter')).toEqual(true);
		expect(encounterListInstance.state('selectedEncounter')).toEqual(selectedEncounter);
	});

	it('should update the state variables when resetState function is called', () => {
		encounterListInstance.instance().resetState();

		expect(encounterListInstance.state('viewEncounter')).toEqual(false);
		expect(encounterListInstance.state('editEncounter')).toEqual(false);
		expect(encounterListInstance.state('selectedEncounter')).toEqual({} as EncounterInterface.IEncounterState);
	});
});
