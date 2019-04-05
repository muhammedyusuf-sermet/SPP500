import * as React from "react"
import * as nock from 'nock';
import { shallow, ShallowWrapper } from 'enzyme';
import {EncounterDetails, IEncounterDetailsState} from '../../src/renderer/components/platform/pages/view_game_components/EncounterDetails';
import * as Encounter from '../../src/encounter';
// import * as Monster from "../../src/monster";
import {API_URL} from '../../src/config'
import MonsterInstances from "../../src/monster_instances";

jest.mock('../../src/cookie');

describe('Test the Encounter View Details Per Encounter', () => {
	let encounterDetailsInstance: ShallowWrapper<any, IEncounterDetailsState, EncounterDetails>;
	let encounterDetailsInstanceFaulty: ShallowWrapper<any, IEncounterDetailsState, EncounterDetails>;

	beforeEach(() => {
		let encounterExample: Encounter.IEncounterState;
		encounterExample = {
			Id: "1",
			Name: "Encounter",
			Description: "This is a fierce encounter...",
			Monsters: MonsterInstances['MonsterInstances'],
		};
		encounterDetailsInstance = shallow(<EncounterDetails encounter={encounterExample} resetParentState={() => {return null;}}/>);
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

	it('successfully deletes the encounter', () => {
		var deleteButton = encounterDetailsInstance.find('#deleteEncounterButton');

		nock(API_URL)
			.post('/encounter/delete', {
					Id: "1",
				})
			.reply(201, {
				body: [{ status: 201, messages: 'success' }],
			});

		deleteButton.simulate('click', {preventDefault: () => {}});
	});

	describe('should show and hide modal', () => {
		it('show modal', () => {
			encounterDetailsInstance.instance().closeModal();
			expect(encounterDetailsInstance.find('#encounterDeletionModal').prop('isActive')).toEqual(false);
			encounterDetailsInstance.instance().openModal('TestMessage');
			expect(encounterDetailsInstance.find('#ModalMessage').text()).toEqual('TestMessage');
			expect(encounterDetailsInstance.find('#encounterDeletionModal').prop('isActive')).toEqual(true);
		})

		it('close modal', () => {
			encounterDetailsInstance.instance().openModal('TestMessage');
			expect(encounterDetailsInstance.find('#ModalMessage').text()).toEqual('TestMessage');
			expect(encounterDetailsInstance.find('#encounterDeletionModal').prop('isActive')).toEqual(true);
			encounterDetailsInstance.instance().closeModal();
			expect(encounterDetailsInstance.find('#encounterDeletionModal').prop('isActive')).toEqual(false);
		})

		it('close modal by click', () => {
			encounterDetailsInstance.instance().openModal('TestMessage');
			expect(encounterDetailsInstance.find('#ModalMessage').text().length).toBeGreaterThan(0);
			expect(encounterDetailsInstance.find('#encounterDeletionModal').prop('isActive')).toEqual(true);
			let background = encounterDetailsInstance.find('#modalBackground')
			background.simulate('click');
			expect(encounterDetailsInstance.find('#encounterDeletionModal').prop('isActive')).toEqual(false);
		})
	});

	describe('Sad Paths', () => {
		beforeEach(() => {
			encounterDetailsInstanceFaulty = shallow(<EncounterDetails encounter={{}} />);
		})

		it('displays error message when no encounter is selected', () => {
			let selectedEncounter: Encounter.IEncounterState;
			selectedEncounter = {} as Encounter.IEncounterState;
			encounterDetailsInstanceFaulty.instance().setState({ encounter: selectedEncounter});
			expect(encounterDetailsInstanceFaulty.find('#errorMessageNoEncounter')).toExist();
		});
	});
});
