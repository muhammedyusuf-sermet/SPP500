import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

//import './css/app.css';

import { HomePage } from './components/Home';
import { Platform } from './components/Platform';
import { CampaignCRUD } from './components/CampaignCRUD';

import { ViewCatalog } from './components/platform/pages/ViewCatalog';
import { ViewGameComponents } from './components/platform/pages/ViewGameComponents';

import "bulma/css/bulma.css";
import { NavBar } from './components/NavBar';
import { AuthContext, IAuthProviderState } from './components/AuthContext';
import { MonsterCRUD, CRUDProcess } from './components/MonsterCRUD';
import { EncounterRun } from './components/platform/pages/run_encounter/EncounterRun';

import { EncounterCRUD } from './components/EncounterCRUD';
import { CharacterCRUD } from './components/CharacterCRUD';

interface IAppProps { }

export class App extends React.Component<IAppProps> {
	constructor(props: IAppProps) {
		super(props);
	}

	/* Todo: Return home page if user is not logged in, return main platform page otherwise */
	render() {
		return (
			<React.Fragment>
				<NavBar />
				<AuthContext.Consumer>
					{ (auth: IAuthProviderState) =>
						(auth.isAuth) ? (
							<Switch>
								<Route exact path="/" component={Platform} />
								<Route path="/encounter/run/:Id" render={(props) => {
									return (
										<EncounterRun Id={props.match.params.Id} />
									);}} />
								<Route path="/campaign/create" render={(props) => {
									return (
										<CampaignCRUD Process={CRUDProcess.Create} />
									);}} />
								<Route path="/campaign/view/:Id" render={(props) => {
									return (
										<CampaignCRUD Process={CRUDProcess.Read} Id={props.match.params.Id} />
									);}} />
								<Route path="/campaign/edit/:Id" render={(props) => {
									return (
										<CampaignCRUD Process={CRUDProcess.Edit} Id={props.match.params.Id} />
									);}} />
								<Route path="/monster/create" render={() => {
									return (
										<MonsterCRUD Process={CRUDProcess.Create} />
									);}} />
								<Route path="/monster/view/:Id" render={(props) => {
									return (
										<MonsterCRUD Process={CRUDProcess.Read} Id={props.match.params.Id} />
									);}} />
								<Route path="/monster/edit/:Id" render={(props) => {
									return (
										<MonsterCRUD Process={CRUDProcess.Edit} Id={props.match.params.Id} />
									);}} />
								<Route path="/character/create" render={() => {
									return (
										<CharacterCRUD Process={CRUDProcess.Create} />
									);}} />
								<Route path="/character/view/:Id" render={(props) => {
									return (
										<CharacterCRUD Process={CRUDProcess.Read} Id={props.match.params.Id} />
									);}} />
								<Route path="/character/edit/:Id" render={(props) => {
									return (
										<CharacterCRUD Process={CRUDProcess.Edit} Id={props.match.params.Id} />
									);}} />
								<Route path="/encounter/create" render={() => {
									return (
										<EncounterCRUD Process={CRUDProcess.Create} />
									);}} />
								<Route path="/encounter/view/:Id" render={(props) => {
									return (
										<EncounterCRUD Process={CRUDProcess.Read} Id={props.match.params.Id} />
									);}} />
								<Route path="/encounter/edit/:Id" render={(props) => {
									return (
										<EncounterCRUD Process={CRUDProcess.Edit} Id={props.match.params.Id} />
									);}} />
								<Route path="/catalog" component={ViewCatalog} />
								<Route path="/game_components" component={ViewGameComponents} />
								<Route path="" component={Platform} />
							</Switch>
						) : (
							<Switch>
								<Route exact path="/" component={HomePage} />
								<Route path="/catalog" component={ViewCatalog} />
								<Route path="" component={HomePage} />
							</Switch>
						)
					}
				</AuthContext.Consumer>
			</React.Fragment>
		);
	}
}
