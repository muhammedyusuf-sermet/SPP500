import * as React from 'react';
import { Link } from 'react-router-dom';

import { Navbar, NavbarBrand, NavbarMenu, NavbarStart, NavbarEnd, NavbarBurger } from 'bloomer';
import { LoginHeader } from './LoginHeader';
import { AuthContext, IAuthProviderState } from './AuthContext';

import "bulma/css/bulma.css";

interface INavBarState {
	isActive: boolean
}

export class NavBar extends React.Component<any, INavBarState> {
	constructor(props: any) {
		super(props);
		this.state = {
			isActive: false
		}
	}

	onClickNav = () => {
		this.setState({
			isActive: !this.state.isActive
		})
	}

	closeNav = () => {
		this.setState({
			isActive: false
		})
	}

	render() {
		return (
			<Navbar className="navbar is-light">
				<NavbarBrand>
					<Link className='navbar-item' to="/" onClick={this.closeNav}>
						<img src={require('../../../../docs/art/DM-Tools-Logo.png')} />
					</Link>
					<NavbarBurger isActive={this.state.isActive} onClick={this.onClickNav} />
				</NavbarBrand>
				<NavbarMenu isActive={this.state.isActive} >
					<AuthContext.Consumer>
						{ (auth: IAuthProviderState) =>
							(auth.isAuth) ? (
								<NavbarStart className='is-light' onClick={this.closeNav}>
									<Link className='navbar-item' to="/encounter/create" replace >Create Encounter</Link>
									<Link className='navbar-item' to="/campaign/create" replace >Create Campaign</Link>
									<Link className='navbar-item' to="/monster/create" replace >Create Monster</Link>
									<Link className='navbar-item' to="/character/create" replace >Create Character</Link>
									<Link className='navbar-item' to="/catalog/monsters" replace >View Catalog</Link>
									<Link className='navbar-item' to="/game_components/encounters" replace >View Game Components</Link>
								</NavbarStart>
							) : (
								<NavbarStart className='is-light' onClick={this.closeNav}>
								</NavbarStart>
							)
						}
					</AuthContext.Consumer>
					<NavbarEnd>
						<LoginHeader />
					</NavbarEnd>
				</NavbarMenu>
			</Navbar>
		);
	}
}
