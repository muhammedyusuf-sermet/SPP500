import * as React from "react"
import * as nock from 'nock';
import { shallow, ShallowWrapper } from 'enzyme';
import {Campaign, ICampaignState} from '../../src/renderer/components/platform/pages/view_game_components/Campaign';
import * as CampaignInterface from '../../src/campaign';
import {API_URL} from '../../src/config'

jest.mock('../../src/cookie');

describe('Test the Campaign View Details', () => {
	let campaignInstance: ShallowWrapper<any, ICampaignState, Campaign>;

	beforeEach(() => {
		campaignInstance = shallow(<Campaign/>);
	})

	it('renders without crashing', () => {
		expect(campaignInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(campaignInstance).toMatchSnapshot();
	});

	it('should update the state variables when resetState function is called', () => {
		campaignInstance.instance().resetState();

		expect(campaignInstance.state('page')).toEqual(0);
	});

	it('should make an GET request to retrieve Campaigns when getPaginatedCampaigns function is called', () => {
		campaignInstance.instance().getPaginatedCampaigns(0);

		nock(API_URL)
		.get('/campaign/get/0/12')
		.reply(201, { status: 201, message: 'success', total: 1, content: [] as CampaignInterface.ICampaignState[] });
	});

	it('should return the total number of pages when getTotalPages function is called', () => {
		campaignInstance.instance().setState({ totalCampaigns: 24});
		let totalPages = campaignInstance.instance().getTotalPages();
		// Starts from 0
		expect(totalPages).toEqual(1);
	});
});
