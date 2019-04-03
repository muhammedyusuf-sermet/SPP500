import * as React from 'react';
//import * as request from 'request';
var request = require('request-promise-native');
import 'bulma/css/bulma.css';
import { Input, Label, Button, Checkbox, Control, Field, TextArea, Modal, ModalContent, ModalBackground, Box} from 'bloomer';
import { Redirect } from "react-router-dom"
import { API_URL } from "../../config"
import { CookieManager } from "../../cookie";

// Todo: Actually get the monsters from the db once the backend is ready
// Dummy array of monsters
/*const monsters = [	{"Id": "1", "Name": "Monster 1"},
					{"Id": "2", "Name": "Monster 2"},
					{"Id": "3", "Name": "Monster 3"}
				];
				*/

interface IEncounterMonsterInformation {
	"Id": string,
	"Name": string,
}

interface IEncounterResponse {
	status: number,
	messages: string[]
}

interface IMonsterGetResponse {
	status: number,
	messages: string[],
	content: IEncounterMonsterInformation[],
	total: number,
}
/*
var getMonsters = async (page: number, pageSize: number) => {

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
	
	var requestResponse;

    await request(options , (error:string, responce: any, body: IMonsterGetResponse) => {
        console.log(body);
		if (!error && body.status === 201) { // success
			console.log("Hello!");
            requestResponse = body;
        } 
	})

	if (requestResponse) {
		console.log(requestResponse);
	}
	return requestResponse;
}
export function getApiCall (page: number, pageSize: number) {
	console.log("It is: " + getMonsters(page, pageSize));

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

	var requestResponse;
    request(options, (error:string, responce: any, body: IMonsterGetResponse) => {
        //console.log(body);
        if (!error && body.status === 201) { // success
            requestResponse = body;
        } 
	})
	
	if (requestResponse) {
		console.log(requestResponse);
	}
	return {status: 500, messages: ["none found"], content: [], total: 0} as IMonsterGetResponse;
}
*/

export interface IEncounterCreationState {
	redirectToHome: boolean,
	checkedMonsters: Map<string, boolean>,
	page: number,
	pageSize: number,
	totalMonsters: number,
	monstersInCurrentPage: IEncounterMonsterInformation[],
	fullInformationOfCheckedMonsters: IEncounterMonsterInformation[],
	encounter: {
		name: string,
		description: string,
	},
	modal: {
		open: boolean,
		message: string
	}
}


/*
const exportFunctions = {
	getApiCall,
  };
  */

export class EncounterCreation extends React.Component<any, IEncounterCreationState> {
	constructor(props: any) {
		super(props);
		this.state = {
			redirectToHome: false,
			checkedMonsters: new Map(),
			page: 0,
			pageSize: 12,
			totalMonsters: 0,
			monstersInCurrentPage: [] as IEncounterMonsterInformation[],
			fullInformationOfCheckedMonsters: [] as IEncounterMonsterInformation[],
			encounter: {
				name: "",
				description: "",
			},
			modal: {
				open: false,
				message: ""
			}
		}
		this.getPaginatedMonsters(this.state.page);
	}

	previousPage() {
		if(this.state.page > 0){
			let newPage = this.state.page-1;
			this.setState({ page: newPage});
			this.getPaginatedMonsters(newPage);
		}
	}

	nextPage() {
		// Starts from 0
		let totalPages = Math.ceil(this.state.totalMonsters / this.state.pageSize)-1;
		if(this.state.page < totalPages){
			let newPage = this.state.page+1;
			this.setState({ page: newPage});
			this.getPaginatedMonsters(newPage);
		}
	}

	getPaginatedMonsters = async (page: number) => {

		//var body = exportFunctions.getApiCall(page, this.state.pageSize);

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

		//console.log(options.url);

		await request(options).then((body: IMonsterGetResponse) => {
			//console.log("Error: " + error);
			//console.log("Response: " + JSON.stringify(responce));
			//console.log("Body: " + JSON.stringify(body));
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
		}).catch((error: string) => {
			this.openModal("There was an error sending your request.")
		})

		/*console.log(body);
		console.log(body.total);
		console.log(body.content);

		if (body.total && body.content) {
			this.setState({
				monstersInCurrentPage: body["content"],
				totalMonsters: body["total"],
		});
		}*/

		/*
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

		//console.log(options.url);

		request(options, (error:string, responce: any, body: any) => {
			//console.log("Error: " + error);
			//console.log("Response: " + JSON.stringify(responce));
			//console.log("Body: " + JSON.stringify(body));
			if (!error && body && body.status === 201) { // success
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
		})*/

		//console.log("mICP:" + this.state.monstersInCurrentPage);
		//console.log("totalMonsters:" + this.state.totalMonsters);
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
		//const id = event.target.attributes['data-id'].value;

		this.setState(prevState => ({ checkedMonsters: prevState.checkedMonsters.set(event.target.name, event.target.checked)}));
		//console.log(this.state.checkedMonsters);
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
		//console.log(this.state.checkedMonsters);
		const checkedMonsterIds = [ ...this.state.checkedMonsters.keys() ];
		const keptMonsterIds = [];
		for (var i = 0; i < checkedMonsterIds.length; i++) {
			if (this.state.checkedMonsters.get(checkedMonsterIds[i].toString())) {
				keptMonsterIds.push({"Id": checkedMonsterIds[i]});
			}
		}

		//console.log(keptMonsterIds);

		const request = require("request");
		const options = { method: 'POST',
			url: API_URL + '/encounter/create',
			timeout: 2000,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json',
				'Authorization': CookieManager.UserToken('session_token')
			},
			body:
			{
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
					if (messages) {
						message = messages.join(' ');
					}
					this.openModal(message);
				}
			}
		});
	}

	cancel = (event: React.FormEvent) => {
		event.preventDefault();
		this.setState({ redirectToHome: true});
	}

	render() {
		return (
			(this.state.redirectToHome && !this.state.modal.open) ? <Redirect to="/"/> :
			<div>
				<form id="createEncounterForm" onSubmit={this.createEncounter}>
					<Field>
						<Label>Encounter Name</Label>
						<Control>
							<Input
									id="encounter_name"
									type="text"
									placeholder='Please enter the name of the encounter.'
									onChange={this.handleNameChange} />
						</Control>
					</Field>

					<Field>
					    <Label>Description</Label>
					    <Control>
					        <TextArea
					        			id="encounter_description"
					        			placeholder={'Please write the encounter description here.'}
					        			onChange={this.handleDescriptionChange} />
					    </Control>
					</Field>

					<Field>
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
					</Field>
					
					<h3>Page No: {this.state.page+1}</h3>
					<a onClick={() => this.previousPage()} id="previousPageButton" className="previous">&laquo; Previous</a>
					<a onClick={() => this.nextPage()} id="nextPageButton" className="next">Next &raquo;</a>
					

					<Field isGrouped>
					    <Control>
					        <Button isColor='primary' type="submit">Submit</Button>
					    </Control>
					    <Control>
					        <Button id="cancel" isLink onClick={this.cancel}>Cancel</Button>
					    </Control>
					</Field>
				</form>
				<Modal id='encounterCreationModal' isActive={this.state.modal.open}>
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