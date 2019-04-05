import * as React from "react"
import * as nock from 'nock';
import { shallow, ShallowWrapper } from 'enzyme';
import {CampaignDetails, ICampaignDetailsState} from '../../src/renderer/components/platform/pages/view_game_components/CampaignDetails';
import * as Campaign from '../../src/campaign';
// import * as Monster from "../../src/monster";
import {API_URL} from '../../src/config'
import EncounterInstances from "../../src/encounter_instances";

jest.mock('../../src/cookie');

describe('Test the Campaign View Details Per Campaign', () => {
	let campaignDetailsInstance: ShallowWrapper<any, ICampaignDetailsState, CampaignDetails>;
	let campaignDetailsInstanceFaulty: ShallowWrapper<any, ICampaignDetailsState, CampaignDetails>;

	beforeEach(() => {
		let campaignExample: Campaign.ICampaignState;
		campaignExample = {
			Id: "1",
			Name: "Campaign",
			Notes: "Notes",
			Summary: "This is a fierce campaign...",
			Encounters: EncounterInstances['EncounterInstances'],
		};
		campaignDetailsInstance = shallow(<CampaignDetails campaign={campaignExample} resetParentState={() => {return null;}}/>);
	})

	it('renders without crashing', () => {
		expect(campaignDetailsInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(campaignDetailsInstance).toMatchSnapshot();
	});

	it('should return true if the ICampaignState object is empty', () => {
		let selectedCampaign: Campaign.ICampaignState;
		selectedCampaign = {} as Campaign.ICampaignState;
		let isEmpty = campaignDetailsInstance.instance().isEmptyObject(selectedCampaign);

		expect(isEmpty).toEqual(true);
	});

	it('successfully deletes the campaign', () => {
		var deleteButton = campaignDetailsInstance.find('#deleteCampaignButton');

		nock(API_URL)
			.post('/campaign/delete', {
					Id: "1",
				})
			.reply(201, {
				body: [{ status: 201, messages: 'success' }],
			});

		deleteButton.simulate('click', {preventDefault: () => {}});
	});

	describe('should show and hide modal', () => {
		it('show modal', () => {
			campaignDetailsInstance.instance().closeModal();
			expect(campaignDetailsInstance.find('#campaignDeletionModal').prop('isActive')).toEqual(false);
			campaignDetailsInstance.instance().openModal('TestMessage');
			expect(campaignDetailsInstance.find('#ModalMessage').text()).toEqual('TestMessage');
			expect(campaignDetailsInstance.find('#campaignDeletionModal').prop('isActive')).toEqual(true);
		})

		it('close modal', () => {
			campaignDetailsInstance.instance().openModal('TestMessage');
			expect(campaignDetailsInstance.find('#ModalMessage').text()).toEqual('TestMessage');
			expect(campaignDetailsInstance.find('#campaignDeletionModal').prop('isActive')).toEqual(true);
			campaignDetailsInstance.instance().closeModal();
			expect(campaignDetailsInstance.find('#campaignDeletionModal').prop('isActive')).toEqual(false);
		})

		it('close modal by click', () => {
			campaignDetailsInstance.instance().openModal('TestMessage');
			expect(campaignDetailsInstance.find('#ModalMessage').text().length).toBeGreaterThan(0);
			expect(campaignDetailsInstance.find('#campaignDeletionModal').prop('isActive')).toEqual(true);
			let background = campaignDetailsInstance.find('#modalBackground')
			background.simulate('click');
			expect(campaignDetailsInstance.find('#campaignDeletionModal').prop('isActive')).toEqual(false);
		})
	});

	describe('Sad Paths', () => {
		beforeEach(() => {
			campaignDetailsInstanceFaulty = shallow(<CampaignDetails campaign={{}} />);
		})

		it('displays error message when no campaign is selected', () => {
			let selectedCampaign: Campaign.ICampaignState;
			selectedCampaign = {} as Campaign.ICampaignState;
			campaignDetailsInstanceFaulty.instance().setState({ campaign: selectedCampaign});
			expect(campaignDetailsInstanceFaulty.find('#errorMessageNoCampaign')).toExist();
		});
	});
});
