import * as React from 'react';
import * as PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import {Monster} from './view_catalog/Monster';

import '../../../css/platform/pages/view_catalog.css';
import { CharacterList } from './view_catalog/CharacterList';

type AppProps = {}

function TabContainer(props: TabContainer.propTypes) {
	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
			{props.children}
		</Typography>
	);
}

TabContainer.propTypes = {
	children: PropTypes.node.isRequired,
};

export const ViewCatalog: React.StatelessComponent<{}> = () => {
	const [value, setValue] = React.useState(0);

	function handleChange(event: AppProps, newValue: number) {
		setValue(newValue);
	}

	return (
		<div className="view-catalog-container">
			<h1 className="page-title">View Catalog Items</h1>
			<div className= "tab-root">
			<AppBar position="static">
				<Tabs value={value} onChange={handleChange}>
					<Tab label="Monsters" />
					<Tab label="Equipment" />
					<Tab label="Locations" />
					<Tab label="Buildings" />
					<Tab label="Characters" />
					<Tab label="Spells" />
				</Tabs>
			</AppBar>
			{value === 0 && <TabContainer><Monster/></TabContainer>}
			{value === 1 && <TabContainer>Equipment</TabContainer>}
			{value === 2 && <TabContainer>Locations</TabContainer>}
			{value === 3 && <TabContainer>Buildings</TabContainer>}
			{value === 4 && <TabContainer><CharacterList/></TabContainer>}
			{value === 5 && <TabContainer>Spells</TabContainer>}
			</div>
		</div>
	);
}
