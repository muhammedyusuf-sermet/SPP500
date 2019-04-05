import * as React from 'react';
import * as PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import {EncounterList} from './view_game_components/EncounterList';
import {CampaignList} from './view_game_components/CampaignList';

import '../../../css/platform/pages/view_game_components.css';

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

export const ViewGameComponents: React.StatelessComponent<{}> = () => {
	const [value, setValue] = React.useState(0);

	function handleChange(event: AppProps, newValue: number) {
		setValue(newValue);
	}

	return (
		<div className="view-game-components-container">
			<h1 className="page-title">View Encounters</h1>
			<div className= "tab-root">
			<AppBar position="static">
				<Tabs value={value} onChange={handleChange}>
					<Tab label="Encounters" />
					<Tab label="Campaigns" />
				</Tabs>
			</AppBar>
			{value === 0 && <TabContainer><EncounterList/></TabContainer>}
			{value === 1 && <TabContainer><CampaignList/></TabContainer>}
			</div>
		</div>
	);
}
