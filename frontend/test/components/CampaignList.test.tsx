import * as React from "react"
import * as nock from 'nock';
import { shallow, ShallowWrapper } from 'enzyme';
import {CampaignList, ICampaignListState} from '../../src/renderer/components/platform/pages/view_game_components/CampaignList';
import * as CampaignInterface from '../../src/campaign';
import {API_URL} from '../../src/config'

jest.mock('../../src/cookie');

describe('Test the CampaignList View Details', () => {
	let campaignListInstance: ShallowWrapper<any, ICampaignListState, CampaignList>;

	beforeEach(() => {
		campaignListInstance = shallow(<CampaignList/>);
	})

	it('renders without crashing', () => {
		expect(campaignListInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(campaignListInstance).toMatchSnapshot();
	});

	it('should update the state variables when View button is clicked for a campaign', () => {
		let selectedCampaign: CampaignInterface.ICampaignState;
		selectedCampaign = {} as CampaignInterface.ICampaignState;
		campaignListInstance.instance().view(selectedCampaign);

		expect(campaignListInstance.state('viewCampaign')).toEqual(true);
		expect(campaignListInstance.state('selectedCampaign')).toEqual(selectedCampaign);
	});

	it('should update the state variables when Edit button is clicked for a campaign', () => {
		let selectedCampaign: CampaignInterface.ICampaignState;
		selectedCampaign = {} as CampaignInterface.ICampaignState;
		campaignListInstance.instance().edit(selectedCampaign);

		expect(campaignListInstance.state('editCampaign')).toEqual(true);
		expect(campaignListInstance.state('selectedCampaign')).toEqual(selectedCampaign);
	});

	it('should update the state variables when resetState function is called', () => {
		campaignListInstance.instance().resetState();

		expect(campaignListInstance.state('viewCampaign')).toEqual(false);
		expect(campaignListInstance.state('editCampaign')).toEqual(false);
		expect(campaignListInstance.state('selectedCampaign')).toEqual({} as CampaignInterface.ICampaignState);
	});

	it('should make an GET request to retrieve campaigns when getPaginatedCampaigns function is called', () => {
		campaignListInstance.instance().getPaginatedCampaigns(0);

		nock(API_URL)
		.get('/campaign/get/0/12')
		.reply(201, { status: 201, message: 'success', total: 1, content: [] as CampaignInterface.ICampaignState[] });
	});

	it('should return the total number of pages when getTotalPages function is called', () => {
		campaignListInstance.instance().setState({ totalCampaigns: 24});
		let totalPages = campaignListInstance.instance().getTotalPages();

		// Starts from 0
		expect(totalPages).toEqual(1);
	});
});