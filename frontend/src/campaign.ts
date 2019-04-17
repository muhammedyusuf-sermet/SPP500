import * as Encounter from "./encounter";

export interface ICampaignState {
	Id?: string,
	Name: string,
	Summary?: string;
	Notes?: string;
	Encounters?: Encounter.IEncounterState[];
}
