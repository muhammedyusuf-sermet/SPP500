import * as React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import {Monster} from './view_catalog/Monster';

import '../../../css/platform/pages/view_catalog.css';
import { Route, RouteComponentProps } from 'react-router';

export interface IViewCatalogProps extends RouteComponentProps{
}

export interface IViewCatalogState {
	value: string;
}

export class ViewCatalog extends React.Component<IViewCatalogProps, IViewCatalogState> {
	constructor(props: IViewCatalogProps) {
		super(props);
		this.state = {
			value: props.location.pathname.split('/').pop() || ''
		}
		console.log(props.location.pathname)
	}

	componentWillReceiveProps = (nextProps: IViewCatalogProps) => {
		this.setState({
			value: nextProps.location.pathname.split('/').pop() || ''
		});
	}

	changeTab = (event: React.ChangeEvent<{}>, newValue: string) => {
		this.props.history.replace('/catalog/'+newValue);
		this.setState({value: newValue});
	}

	render() {
		return (
			<div className="view-catalog-container">
				<h1 className="page-title">View Catalog Items</h1>
				<div className= "tab-root">
					<AppBar position="static">
						<Tabs value={this.state.value} onChange={this.changeTab}>
							<Tab label="Monsters" value='monsters' />
							<Tab label="Equipment" value='equipment' />
							<Tab label="Locations" value='locations' />
							<Tab label="Buildings" value='buildings' />
							<Tab label="Spells" value='spells' />
						</Tabs>
					</AppBar>
					<Route path={`${this.props.match.url}/monsters`} component={Monster} />
					<Route path={`${this.props.match.url}/equipment`} render={() => (
						<Typography component="div" style={{ padding: 8 * 3 }}>Equipment</Typography>
					)} />
					<Route path={`${this.props.match.url}/locations`} render={() => (
						<Typography component="div" style={{ padding: 8 * 3 }}>Locations</Typography>
					)} />
					<Route path={`${this.props.match.url}/buildings`} render={() => (
						<Typography component="div" style={{ padding: 8 * 3 }}>Buildings</Typography>
					)} />
					<Route path={`${this.props.match.url}/spells`} render={() => (
						<Typography component="div" style={{ padding: 8 * 3 }}>Spells</Typography>
					)} />
				</div>
			</div>
		);
	}
}
