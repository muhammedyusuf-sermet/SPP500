import * as React from "react"
import * as nock from 'nock';
import { shallow, ShallowWrapper } from 'enzyme';
import { CampaignList, ICampaignListState } from '../../src/renderer/components/platform/pages/view_game_components/CampaignList';

import {API_URL} from '../../src/config'
import { CampaignInstances } from "../../src/campaign_instances";

jest.mock('../../src/cookie');

describe('Test the Campaign View Details', () => {
	let campaignInstance: ShallowWrapper<any, ICampaignListState, CampaignList>;

	beforeEach( async (done) => {
		nock.disableNetConnect();
		nock(API_URL)
		.get('/campaign/get/0/12')
		.reply(200, {
			status: 201,
			messages: ['success'],
			total: 0,
			content: []
		});
		campaignInstance = shallow(<CampaignList/>);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		expect(nock.isDone()).toEqual(true);
		done();
	})

	it('renders without crashing', () => {
		expect(campaignInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(campaignInstance).toMatchSnapshot();
	});

	it('should make an GET request to retrieve campaigns when getPaginatedCampaigns function is called', async (done) => {
		nock(API_URL)
		.get('/campaign/get/0/12')
		.reply(200, {
			status: 201,
			messages: ['success'],
			total: 12,
			content: CampaignInstances
		});

		campaignInstance.instance().getPaginatedCampaigns(0);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));

		expect(campaignInstance.state().campaignsInCurrentPage).toEqual(CampaignInstances)
		expect(campaignInstance.state().totalCampaigns).toEqual(12);
		expect(nock.isDone()).toEqual(true);
		done();
	});

	it('should make an GET request to retrieve campaigns when updatePage function is called', async (done) => {
		nock(API_URL)
		.get('/campaign/get/0/12')
		.reply(200, {
			status: 201,
			messages: ['success'],
			total: 12,
			content: CampaignInstances
		});

		campaignInstance.instance().updatePage(0);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));

		expect(campaignInstance.state().campaignsInCurrentPage).toEqual(CampaignInstances)
		expect(campaignInstance.state().totalCampaigns).toEqual(12);
		expect(nock.isDone()).toEqual(true);
		done();
	});

	it('should fail gracefully when getPaginatedCampaigns function is called', async (done) => {
		nock(API_URL)
		.get('/campaign/get/0/12')
		.replyWithError('access denied');

		campaignInstance.instance().getPaginatedCampaigns(0);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));

		expect(campaignInstance.state().campaignsInCurrentPage).toEqual([])
		expect(campaignInstance.state().totalCampaigns).toEqual(0);
		expect(nock.isDone()).toEqual(true);
		done();
	});

	it('should make an DELETE request to delete campaign when deleteCampaign function is called', async (done) => {
		nock(API_URL)
		.delete('/campaign/1')
		.reply(200, {
			status: 201,
			messages: ['success']
		});
		nock(API_URL)
		.get('/campaign/get/0/12')
		.reply(200, {
			status: 201,
			messages: ['success'],
			total: 11,
			content: CampaignInstances.slice(1)
		});

		campaignInstance.instance().deleteCampaign({ currentTarget: { value: '1'}} as React.MouseEvent<HTMLButtonElement>);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));

		expect(campaignInstance.state().campaignsInCurrentPage).toEqual(CampaignInstances.slice(1))
		expect(campaignInstance.state().totalCampaigns).toEqual(11);
		expect(nock.isDone()).toEqual(true);
		done();
	});

	it('should return the total number of pages when getTotalPages function is called', () => {
		campaignInstance.instance().setState({ totalCampaigns: 24});
		let totalPages = campaignInstance.instance().getTotalPages();

		// Starts from 0
		expect(totalPages).toEqual(1);
	});
});
