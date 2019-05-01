import * as React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import {EncounterList} from './view_game_components/EncounterList';
import {Campaign} from './view_game_components/Campaign';

import '../../../css/platform/pages/view_game_components.css';
import { RouteComponentProps, Route } from 'react-router';
import { CharacterList } from './view_game_components/CharacterList';

export interface IViewGameComponentsProps extends RouteComponentProps{
}

export interface IViewGameComponentsState {
	value: string;
}

export class ViewGameComponents extends React.Component<IViewGameComponentsProps, IViewGameComponentsState> {
	constructor(props: IViewGameComponentsProps) {
		super(props);
		this.state = {
			value: props.location.pathname.split('/').pop() || 'encounters'
		}
	}

	componentWillReceiveProps(nextProps: IViewGameComponentsProps) {
		this.setState({
			value: nextProps.location.pathname.split('/').pop() || 'encounters'
		});
	}

	changeTab = (event: React.ChangeEvent<{}>, newValue: string) => {
		this.props.history.replace('/game_components/'+newValue);
		this.setState({value: newValue});
	}

	render() {
		return (
			<div className="view-game-components-container">
				<h1 className="page-title">View Catalog Items</h1>
				<div className= "tab-root">
					<AppBar position="static">
						<Tabs value={this.state.value} onChange={this.changeTab} >
							<Tab label="Encounters" value='encounters' />
							<Tab label="Campaigns" value='campaigns' />
							<Tab label="Characters" value='characters' />
						</Tabs>
					</AppBar>
					<Route path={`${this.props.match.url}/encounters`} component={EncounterList} />
					<Route path={`${this.props.match.url}/campaigns`} component={Campaign} />
					<Route path={`${this.props.match.url}/characters`} component={CharacterList} />
				</div>
			</div>
		);
	}
}
