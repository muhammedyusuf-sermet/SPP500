import * as React from 'react';
import * as request from 'request';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {CampaignDetails} from './CampaignDetails';
import {Pagination} from '../../../helpers/Pagination';

import * as CampaignInterface from '../../../../../campaign';
import { CookieManager } from '../../../../../cookie';
import { API_URL } from '../../../../../config';

interface ICampaignGetResponse {
	status: number,
	messages: string[],
	content: CampaignInterface.ICampaignState[],
	total: number,
}

export interface ICampaignListState {
	viewCampaign: boolean,
	editCampaign: boolean,
	selectedCampaign: CampaignInterface.ICampaignState,

	pageSize: number,
	totalCampaigns: number,
	campaignsInCurrentPage: CampaignInterface.ICampaignState[],
}

export class CampaignList extends React.Component<any, ICampaignListState> {
	constructor(props: any) {
		super(props);
		this.state = {
			viewCampaign: false,
			editCampaign: false,
			selectedCampaign: {} as CampaignInterface.ICampaignState,

			pageSize: 12,
			totalCampaigns: 0,
			campaignsInCurrentPage: [] as CampaignInterface.ICampaignState[],
		}
		this.resetState = this.resetState.bind(this);
		this.updatePage = this.updatePage.bind(this);
		this.getTotalPages = this.getTotalPages.bind(this);

		// First page ever
		this.getPaginatedCampaigns(0);
	}

	resetState() {
		this.setState({ selectedCampaign: {} as CampaignInterface.ICampaignState});
		this.setState({ viewCampaign: false});
		this.setState({ editCampaign: false});
		this.getPaginatedCampaigns(0);
	}

	updatePage(page: number) {
		this.getPaginatedCampaigns(page);
	}

	getTotalPages() {
		return Math.ceil(this.state.totalCampaigns / this.state.pageSize)-1;
	}

	view = (campaign: CampaignInterface.ICampaignState) => {
		this.setState({ selectedCampaign: campaign});
		this.setState({ viewCampaign: true});
	}

	edit = (campaign: CampaignInterface.ICampaignState) => {
		this.setState({ selectedCampaign: campaign});
		this.setState({ editCampaign: true});
	}

	getPaginatedCampaigns(page: number) {
		var options = { method: 'GET',
			url: API_URL + '/campaign/get/' + page + '/' + this.state.pageSize,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json' ,
				'Authorization': CookieManager.UserToken('session_token')
			},
			json: true
		};

		request(options, (error:string, responce: any, body: ICampaignGetResponse) => {
			if (!error && body.status === 201) { // success
				this.setState({
						campaignsInCurrentPage: body.content,
						totalCampaigns: body.total,
				});
			} else {
				// There was an error retrieving the campaign. Just return empty array.
				// No need to print a modal.
				this.setState({
						campaignsInCurrentPage: [] as CampaignInterface.ICampaignState[],
						totalCampaigns: 0,
				});
			}
		})
	}

	render() {
		if(!this.state.viewCampaign && !this.state.editCampaign){
			return (
				<div id="view-campaign-container" className= "layout card-grid">
					<Pagination getTotalPages={this.getTotalPages} onPageChange={this.updatePage} ></Pagination>
					<Grid container spacing={40}>
						{this.state.campaignsInCurrentPage.map(campaign => (
							<Grid item key={campaign.Id} sm={6} md={4} lg={3}>
								<Card className="card">
								  <CardMedia
									className="card-media"
									image="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" // eslint-disable-line max-len
									title="Image title"
								  />
								  <CardContent className="card-content">
									<Typography gutterBottom variant="h5" component="h2">
									  {campaign.Name} {campaign.Id}
									</Typography>
									<Typography>
									  {campaign.Description}.
									</Typography>
								  </CardContent>
								  <CardActions>
									<Button size="small" color="primary" onClick={() => this.view(campaign)}>
									  View
									</Button>
									<Button size="small" color="primary" onClick={() => this.edit(campaign)}>
									  Edit
									</Button>
								  </CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
				</div>
			)
		}
		else if(this.state.viewCampaign){
			return (<CampaignDetails campaign={this.state.selectedCampaign} resetParentState={this.resetState}/>);
		}
		else{
			// Todo: To enable editing, just use the same component as CampaignDetails:
			// enable edit button, remove readOnly, and add the code to submit the changes
			return (<div>Editing Feature is not yet enabled. Please check again later.</div>);
		}
	}
}
