import { ICharacterData } from "./character";
import { IEncounterState } from "./encounter";

export interface ICampaignState {
	Id?: number;
	Name: string;
	Summary?: string;
	Notes?: string;
	Characters: ICharacterData[];
	Encounters: IEncounterState[];
}
