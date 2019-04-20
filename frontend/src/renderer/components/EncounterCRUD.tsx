import * as React from 'react';
var request = require('request-promise-native');
import 'bulma/css/bulma.css';
import { Input, Label, Button, Checkbox, Control, Field, TextArea, Modal, ModalContent, ModalBackground, Box, Tile, Subtitle} from 'bloomer';
import { Redirect } from "react-router-dom"
import { API_URL } from "../../config"
import { CookieManager } from "../../cookie";
import {Pagination} from "./helpers/Pagination"

import {IEncounterState} from '../../encounter';
import {IMonsterState} from '../../monster';

interface IEncounterResponse {
	status: number,
	messages: string[]
}

// Getting All Monsters For Encounter Creation
interface IEncounterMonsterInformation {
	"Id": string,
	"Name": string,
}

interface IMonsterGetResponse {
	status: number,
	messages: string[],
	content: IEncounterMonsterInformation[],
	total: number,
}

export async function getMonsters(page: number, pageSize: number) {

	var options = { method: 'GET',
		url: API_URL + '/monster/get/' + page + '/' + pageSize,
		headers:
		{
			'Cache-Control': 'no-cache',
			'Content-Type': 'application/json' ,
			'Authorization': CookieManager.UserToken('session_token')
		},
		json: true
	};
	let result: IMonsterGetResponse = await request(options);
	return result;
}
// End of Getting All Monsters For Encounter Creation

export enum EncounterCRUDState {
	Create = 'Create',
	Read = 'Read',
	Edit = 'Edit'
}

export interface IEncounterCRUDProps {
	Process: EncounterCRUDState;
	Id?: number;
}

export interface IEncounterGetOneResponse {
	status: number,
	messages: string[],
	content: IEncounterState,
}

export interface IEncounterCRUDState {
	Process: EncounterCRUDState;
	Id?: number;
	redirectToHome: boolean,
	checkedMonsters: Map<string, boolean>, // <MonsterID, IsChecked>
	page: number,
	pageSize: number,
	totalMonsters: number,
	monstersInCurrentPage: IEncounterMonsterInformation[],
	fullInformationOfCheckedMonsters: IEncounterMonsterInformation[],
	encounter: {
		name: string,
		description: string,
		monsters: IMonsterState[],
	},
	modal: {
		open: boolean,
		message: string
	}
}

export class EncounterCRUD extends React.Component<IEncounterCRUDProps, IEncounterCRUDState> {
	constructor(props: IEncounterCRUDProps) {
		super(props);
		this.state = {
			Process: props.Process,
			Id: props.Id,
			redirectToHome: false,
			checkedMonsters: new Map<string, boolean>([]),
			page: 0,
			pageSize: 12,
			totalMonsters: 0,
			monstersInCurrentPage: [] as IEncounterMonsterInformation[],
			fullInformationOfCheckedMonsters: [] as IEncounterMonsterInformation[],
			encounter: {
				name: "",
				description: "",
				monsters: [] as IMonsterState[],
			},
			modal: {
				open: false,
				message: ""
			}
		}

		this.updatePage = this.updatePage.bind(this);
		this.getTotalPages = this.getTotalPages.bind(this);

		this.getPaginatedMonsters(this.state.page);
	}

	componentDidMount() {
		if (this.props.Process != EncounterCRUDState.Create){
			const options = { method: 'GET',
				url: API_URL + '/encounter/' + this.props.Id,
				headers:
				{
					'Cache-Control': 'no-cache',
					'Authorization': CookieManager.UserToken('session_token')
				},
				json: true
			};

			request(options)
				.then((body: IEncounterGetOneResponse) => {
					if (body.status == 201) { // success
						var encounter = {...this.state.encounter}
						encounter.name = body.content.Name;
						encounter.description = body.content.Description;
						encounter.monsters = body.content.Monsters;
						this.setState({encounter})

						body.content.Monsters.forEach(monster => {
							var monsterID = monster.Id as number;
							this.setState(prevState => ({ checkedMonsters: prevState.checkedMonsters.set(monsterID.toString(), true)}));
						});

					} else if (body.messages) {
						this.openModal("Error finding encounter: "+body.messages.toString());
					}else{
						this.openModal("There was an error retreiving the encounter. Please try again later.")
					}
				})
				.catch((error: string) => {
					this.openModal("There was an error sending your request.")
				})
		}
	}

	getPaginatedMonsters = async (page: number) => {

		let body: IMonsterGetResponse = await getMonsters(page, this.state.pageSize);

		if (body.status === 201) { // success
			this.setState({
					monstersInCurrentPage: body.content,
					totalMonsters: body.total,
			});
		} else {
			// There was an error retrieving the monsters. Just return empty array.
			// No need to print a modal.
			this.setState({
					monstersInCurrentPage: [] as IEncounterMonsterInformation[],
					totalMonsters: 0,
			});
		}
	}

	handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const encounter = this.state.encounter
		this.setState({
			encounter: { ...encounter, name: event.target.value }
		})
	}

	handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const encounter = this.state.encounter
		this.setState({
			encounter: { ...encounter, description: event.target.value }
		})
	}

	handleMonsterCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.persist();

		this.setState(prevState => ({ checkedMonsters: prevState.checkedMonsters.set(event.target.name, event.target.checked)}));
	}

	openModal = (messageText: string) => {
		const modal = this.state.modal
		this.setState({ modal: {...modal, open: true, message: messageText }});
	};

	closeModal = () => {
		const modal = this.state.modal
		this.setState({ modal: {...modal, open: false }});
	};

	createEncounter = (event: React.FormEvent) => {
		event.preventDefault();
		this.saveEncounter();
	}

	saveEncounter = (callback?: (message: string) => void) => {
		// Gather the selected monsters for this encounter
		const checkedMonsterIds = [ ...this.state.checkedMonsters.keys() ];
		const keptMonsterIds = [];
		for (var i = 0; i < checkedMonsterIds.length; i++)
			// Check if the monster is checked
			if (this.state.checkedMonsters.get(checkedMonsterIds[i].toString()))
				keptMonsterIds.push({"Id": checkedMonsterIds[i]});

		const request = require("request");
		let route = '/encounter';
		if (this.state.Process == EncounterCRUDState.Create) {
			route += '/create';
		} else {//if (this.state.Process == EncounterCRUDState.Edit) {
			route += '/edit'
		}
		const options = { method: 'POST',
			url: API_URL + route,
			timeout: 2000,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json',
				'Authorization': CookieManager.UserToken('session_token')
			},
			body:
			{
				Id: this.state.Id, // If we reach this part of the code, it means that we have an Id.
				Name: this.state.encounter.name,
				Description: this.state.encounter.description,
				Monsters: keptMonsterIds
			},
			json: true
		};
		request(options, (error: string, response: string, body: IEncounterResponse) => {
			if (error) {
				this.openModal("There has been a server error when saving the encounter. Please try again later.");
			} else {
				let { status, messages } = body
				if (status == 201){
					this.openModal("Hooray, the encounter is successfully saved!");
					this.setState({ redirectToHome: true});
				}
				else{
					let message = "There has been an error saving the encounter. Please check your input and try again."
					if (messages)
						message = messages.join(' ');
					this.openModal(message);
				}
			}
		});
	}

	cancel = (event: React.FormEvent) => {
		event.preventDefault();
		this.setState({ redirectToHome: true});
	}

	updatePage(page: number) {
		this.getPaginatedMonsters(page);
	}

	getTotalPages() {
		return Math.ceil(this.state.totalMonsters / this.state.pageSize)-1;
	}

	render() {
		return (
			(this.state.redirectToHome && !this.state.modal.open) ? <Redirect to="/"/> :
			<div>
				<form id="createEncounterForm" onSubmit={this.createEncounter}>
					<Tile className="box" isVertical>
						<Subtitle>Encounter Name</Subtitle>
						<Control>
							<Input
								disabled={this.state.Process == EncounterCRUDState.Read}
								id="encounter_name"
								type="text"
								placeholder='Please enter the name of the encounter.'
								value={this.state.encounter.name}
								onChange={this.handleNameChange} />
						</Control>
					</Tile>

					<Tile className="box" isVertical>
						<Subtitle>Description</Subtitle>
						<Control>
							<TextArea
								disabled={this.state.Process == EncounterCRUDState.Read}
								id="encounter_description"
								placeholder={'Please write the encounter description here.'}
								value={this.state.encounter.description}
								onChange={this.handleDescriptionChange} />
						</Control>
					</Tile>

					{this.state.Process == EncounterCRUDState.Read ? 

						<Tile className="box" isVertical>
							<Subtitle>Monsters</Subtitle>
							{this.state.encounter.monsters.map(monster => (
								<Control key={monster.Id}>
									<Label>{monster.Name} {monster.Id}</Label>
								</Control>
							))}
						</Tile>

						:

						<Tile className="box" isVertical>
							<Subtitle>Available Monsters</Subtitle>
							<Control>
								{this.state.monstersInCurrentPage.map(monster => (
									<Checkbox 	key={monster.Id}
												name={monster.Id}
												checked={this.state.checkedMonsters.get(monster.Id)}
												onChange={this.handleMonsterCheckboxChange}>
										{monster.Name}
									</Checkbox>
								))}
							</Control>

							<Pagination getTotalPages={this.getTotalPages} onPageChange={this.updatePage} ></Pagination>
						</Tile>
					}

					<Field isGrouped>
						{
							this.state.Process == EncounterCRUDState.Read ? null :
							<Field>
								<Button id='SubmitButton' isColor='primary' type="submit" isLoading={false}>{this.state.Process} Encounter</Button>
							</Field>
						}
						<Field>
							<Button id='BackButton' isColor='secondary' isLoading={false} onClick={this.cancel}>
								{this.state.Process == EncounterCRUDState.Read ? 'Back' : 'Cancel'}
							</Button>
						</Field>
					</Field>
				</form>
				<Modal id='encounterCRUDModal' isActive={this.state.modal.open}>
					<ModalBackground id='modalBackground' onClick={()=>{
						this.closeModal();
					}}/>
					<ModalContent>
						<Box>
							<span id="ModalMessage">{this.state.modal.message}</span>
						</Box>
					</ModalContent>
				</Modal>
			</div>
		);
	}
}