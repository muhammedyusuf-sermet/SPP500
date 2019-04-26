import * as React from "react"
import * as nock from 'nock';
import { shallow, ShallowWrapper } from 'enzyme';
import {CharacterList, ICharacterListState} from '../../src/renderer/components/platform/pages/view_game_components/CharacterList';
import {API_URL} from '../../src/config'
import { ICharacterData } from "../../src/character";

jest.mock('../../src/cookie');

describe('Test the CharacterList View Details', () => {
	let characterListInstance: ShallowWrapper<any, ICharacterListState, CharacterList>;

	beforeEach(() => {
		characterListInstance = shallow(<CharacterList/>);
	})

	it('renders without crashing', () => {
		expect(characterListInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(characterListInstance).toMatchSnapshot();
	});

	it('should make an GET request to retrieve encounters when getPaginatedCharacters function is called', () => {
		characterListInstance.instance().getPaginatedCharacters(0);

		nock(API_URL)
		.get('/encounter/get/0/12')
		.reply(201, { status: 201, message: 'success', total: 1, content: [] as ICharacterData[] });
	});

	it('should return the total number of pages when getTotalPages function is called', () => {
		characterListInstance.instance().setState({ totalCharacters: 24});
		let totalPages = characterListInstance.instance().getTotalPages();

		// Starts from 0
		expect(totalPages).toEqual(1);
	});
});
