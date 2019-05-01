import * as Encounter from "./encounter";

export interface ICampaignState {
	Id?: number,
	Name: string,
	Summary?: string;
	Notes?: string;
	Encounters?: Encounter.IEncounterState[];
}