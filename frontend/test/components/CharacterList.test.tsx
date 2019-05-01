import * as React from "react"
import * as nock from 'nock';
import { shallow, ShallowWrapper } from 'enzyme';
import {CharacterList, ICharacterListState} from '../../src/renderer/components/platform/pages/view_game_components/CharacterList';
import {API_URL} from '../../src/config'
import { CharacterInstances } from "../../src/character_instances";

jest.mock('../../src/cookie');

describe('Test the CharacterList View Details', () => {
	let characterListInstance: ShallowWrapper<any, ICharacterListState, CharacterList>;

	beforeEach( async (done) => {
		nock.disableNetConnect();
		nock(API_URL)
		.get('/character/get/0/12')
		.reply(200, {
			status: 201,
			messages: ['success'],
			total: 0,
			content: []
		});
		characterListInstance = shallow(<CharacterList/>);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		expect(nock.isDone()).toEqual(true);
		done();
	})

	it('renders without crashing', () => {
		expect(characterListInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(characterListInstance).toMatchSnapshot();
	});

	it('should make an GET request to retrieve encounters when getPaginatedCharacters function is called', async (done) => {
		nock(API_URL)
		.get('/character/get/0/12')
		.reply(200, {
			status: 201,
			messages: ['success'],
			total: 12,
			content: CharacterInstances
		});

		characterListInstance.instance().getPaginatedCharacters(0);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));

		expect(characterListInstance.state().charactersInCurrentPage).toEqual(CharacterInstances)
		expect(characterListInstance.state().totalCharacters).toEqual(12);
		expect(nock.isDone()).toEqual(true);
		done();
	});

	it('should make an GET request to retrieve encounters when updatePage function is called', async (done) => {
		nock(API_URL)
		.get('/character/get/0/12')
		.reply(200, {
			status: 201,
			messages: ['success'],
			total: 12,
			content: CharacterInstances
		});

		characterListInstance.instance().updatePage(0);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));

		expect(characterListInstance.state().charactersInCurrentPage).toEqual(CharacterInstances)
		expect(characterListInstance.state().totalCharacters).toEqual(12);
		expect(nock.isDone()).toEqual(true);
		done();
	});

	it('should fail gracefully when getPaginatedCharacters function is called', async (done) => {
		nock(API_URL)
		.get('/character/get/0/12')
		.replyWithError('access denied');

		characterListInstance.instance().getPaginatedCharacters(0);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));

		expect(characterListInstance.state().charactersInCurrentPage).toEqual([])
		expect(characterListInstance.state().totalCharacters).toEqual(0);
		expect(nock.isDone()).toEqual(true);
		done();
	});

	it('should make an DELETE request to delete character when deleteCharacter function is called', async (done) => {
		nock(API_URL)
		.delete('/character/1')
		.reply(200, {
			status: 201,
			messages: ['success']
		});
		nock(API_URL)
		.get('/character/get/0/12')
		.reply(200, {
			status: 201,
			messages: ['success'],
			total: 11,
			content: CharacterInstances.slice(1)
		});

		characterListInstance.instance().deleteCharacter({ currentTarget: { value: '1'}} as React.MouseEvent<HTMLButtonElement>);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));

		expect(characterListInstance.state().charactersInCurrentPage).toEqual(CharacterInstances.slice(1))
		expect(characterListInstance.state().totalCharacters).toEqual(11);
		expect(nock.isDone()).toEqual(true);
		done();
	});

	it('should return the total number of pages when getTotalPages function is called', () => {
		characterListInstance.instance().setState({ totalCharacters: 24});
		let totalPages = characterListInstance.instance().getTotalPages();

		// Starts from 0
		expect(totalPages).toEqual(1);
	});
});
