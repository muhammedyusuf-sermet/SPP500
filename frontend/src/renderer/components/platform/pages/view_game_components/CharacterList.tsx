import * as React from 'react';
import * as request from 'request';
import { API_URL } from '../../../../../config';
import { CookieManager } from '../../../../../cookie';

import {Pagination} from '../../../helpers/Pagination';

import { Card, CardActions, CardContent, CardMedia, Grid, Typography, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { Link } from 'react-router-dom';
import { ICharacterData } from '../../../../../character';

interface ICharacterGetResponse {
	status: number,
	messages: string[],
	content: ICharacterData[],
	total: number,
}

interface ICharacterDeleteResponse {
	status: number,
	messages: string[]
}

export interface ICharacterListState {
	page: number;
	pageSize: number,
	totalCharacters: number,
	charactersInCurrentPage: ICharacterData[],
}

export class CharacterList extends React.Component<any, ICharacterListState> {
	constructor(props: any) {
		super(props);
		this.state = {
			page: 0,
			pageSize: 12,
			totalCharacters: 0,
			charactersInCurrentPage: [] as ICharacterData[],
		}

		// First page ever
		this.getPaginatedCharacters(0);
	}

	updatePage = (page: number) => {
		this.getPaginatedCharacters(page);
	}

	getTotalPages = () => {
		return Math.ceil(this.state.totalCharacters / this.state.pageSize)-1;
	}

	deleteCharacter = (event: React.MouseEvent<HTMLButtonElement>) => {
		var options = { method: 'DELETE',
			url: API_URL + '/character/' + event.currentTarget.value,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Authorization': CookieManager.UserToken('session_token')
			}
		};

		request(options, (error: string, response: any, body: ICharacterDeleteResponse) => {
			this.getPaginatedCharacters(this.state.page);
		});
	}

	getPaginatedCharacters = (page: number) => {
		var options = { method: 'GET',
			url: API_URL + '/character/get/' + page + '/' + this.state.pageSize,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json' ,
				'Authorization': CookieManager.UserToken('session_token')
			},
			json: true
		};

		request(options, (error:string, responce: any, body: ICharacterGetResponse) => {
			if (!error && body.status === 201) { // success
				this.setState({
						charactersInCurrentPage: body.content,
						totalCharacters: body.total,
				});
			} else {
				// There was an error retrieving the characters. Just return empty array.
				// No need to print a modal.
				this.setState({
						charactersInCurrentPage: [] as ICharacterData[],
						totalCharacters: 0,
				});
			}
		})
	}

	render() {
		return (
			<div id="view-characters-container" className= "layout card-grid">
				<Pagination getTotalPages={this.getTotalPages} onPageChange={this.updatePage} ></Pagination>
				<Grid container spacing={40}>
					{this.state.charactersInCurrentPage.map(character => (
						<Grid item key={character.Id} sm={6} md={4} lg={3}>
							<Card className="card">
								<CardMedia
									className="card-media"
									image="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" // eslint-disable-line max-len
									title="Image title"
								/>
								<CardContent className="card-content">
									<Grid container spacing={8} >
										<Grid item xs={12}>
											<Typography gutterBottom variant="h5" component="h2">
												{character.Name} - {character.Id}
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography id='ArmorClass' className='body1' >{'AC: '+character.ArmorClass}</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography id='HitPoints' className='body1' >{'HP: '+character.MaxHealth}</Typography>
										</Grid>
										<Grid item xs={12}>
											<Typography id='Notes' className='body1' >{character.Notes}</Typography>
										</Grid>
									</Grid>
								</CardContent>
								<CardActions>
									<Link to={ "/character/view/"+character.Id }>
										View
									</Link>
									<Link to={ "/character/edit/"+character.Id }>
										Edit
									</Link>
									<Button variant="contained" color="secondary" value={character.Id} onClick={this.deleteCharacter} >
										Delete
										<DeleteIcon/>
									</Button>
								</CardActions>
							</Card>
						</Grid>
					))}
				</Grid>
			</div>
		);
	}
}
