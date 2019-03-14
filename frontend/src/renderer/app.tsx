import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

//import './css/app.css';

import { HomePage } from './components/Home';
import { Platform } from './components/Platform';
import { MonsterCreation } from './components/MonsterCreation';
import { EncounterCreation } from './components/EncounterCreation';
import { ViewCatalog } from './components/platform/pages/ViewCatalog';

import "bulma/css/bulma.css";
import { NavBar } from './components/NavBar';
import { AuthContext, IAuthProviderState } from './components/AuthContext';

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
								<Route path="/encounter_creation" component={EncounterCreation} />
								<Route path="/monster_creation" component={MonsterCreation} />
								<Route path="/catalog" component={ViewCatalog} />
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
