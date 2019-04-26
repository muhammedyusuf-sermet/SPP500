import * as Encounter from "./encounter";

export interface ICampaignData {
	Id?: number,
	Name: string,
	Summary?: string;
	Notes?: string;
	Encounters?: Encounter.IEncounterData[];
}
