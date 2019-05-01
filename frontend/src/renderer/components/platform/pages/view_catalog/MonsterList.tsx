import * as React from 'react';
import * as request from 'request';

import { API_URL } from '../../../../../config';
import { CookieManager } from '../../../../../cookie';

import {Pagination} from '../../../helpers/Pagination';

import { Card, CardActions, CardContent, CardMedia, Grid, Typography, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { Link } from 'react-router-dom';
import { IMonsterData } from '../../../../../monster';

interface IMonsterGetResponse {
	status: number,
	messages: string[],
	content: IMonsterData[],
	total: number,
}

interface IMonsterDeleteResponse {
	status: number,
	messages: string[]
}

export interface IMonsterListState {
	page: number,
	pageSize: number,
	totalMonsters: number,
	monstersInCurrentPage: IMonsterData[],
}

export class MonsterList extends React.Component<any, IMonsterListState> {
	constructor(props: any) {
		super(props);
		this.state = {
			page: 0,
			pageSize: 12,
			totalMonsters: 0,
			monstersInCurrentPage: [] as IMonsterData[],
		}

		// First page ever
		this.getPaginatedMonsters(0);
	}

	updatePage = (page: number) => {
		this.getPaginatedMonsters(page);
	}

	getTotalPages = () => {
		return Math.ceil(this.state.totalMonsters / this.state.pageSize)-1;
	}

	deleteMonster = (event: React.MouseEvent<HTMLButtonElement>) => {
		var options = { method: 'DELETE',
			url: API_URL + '/monster/' + event.currentTarget.value,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Authorization': CookieManager.UserToken('session_token')
			}
		};

		request(options, (error:string, responce: any, body: IMonsterDeleteResponse) => {
			this.getPaginatedMonsters(this.state.page);
		})
	}

	getPaginatedMonsters(page: number) {
		var options = { method: 'GET',
			url: API_URL + '/monster/get/' + page + '/' + this.state.pageSize,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json' ,
				'Authorization': CookieManager.UserToken('session_token')
			},
			json: true
		};

		request(options, (error:string, responce: any, body: IMonsterGetResponse) => {
			if (!error && body.status === 201) { // success
				this.setState({
						monstersInCurrentPage: body.content,
						totalMonsters: body.total,
				});
			} else {
				// There was an error retrieving the monsters. Just return empty array.
				// No need to print a modal.
				this.setState({
						monstersInCurrentPage: [] as IMonsterData[],
						totalMonsters: 0,
				});
			}
		})
	}

	render() {
		return (
			<div id="view-monsters-container" className="layout card-grid">
				<Pagination getTotalPages={this.getTotalPages} onPageChange={this.updatePage} ></Pagination>
				<Grid container spacing={40}>
					{this.state.monstersInCurrentPage.map(monster => (
						<Grid item key={monster.Id} sm={6} md={4} lg={3}>
							<Card className="card">
								<CardMedia
									className="card-media"
									image="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" // eslint-disable-line max-len
									title="Image title" />
								<CardContent className="card-content">
									<Typography gutterBottom variant="h5" component="h2">
										{monster.Name} {monster.Id}
									</Typography>
									<Typography>
										This is a {monster.Size} {monster.Race}, and is a type of {monster.Type} monsters.
									</Typography>
								</CardContent>
								<CardActions>
									<Link to={ "/monster/view/"+monster.Id }>
										View
									</Link>
									<Link to={ "/monster/edit/"+monster.Id }>
										Edit
									</Link>
									<Button variant="contained" color="secondary" value={monster.Id} onClick={this.deleteMonster} >
										Delete
										<DeleteIcon/>
									</Button>
								</CardActions>
							</Card>
						</Grid>
					))}
				</Grid>
			</div>
			)
	}
}
