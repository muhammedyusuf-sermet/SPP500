import { ICharacterData } from "./character";
import { IEncounterData } from "./encounter";

export interface ICampaignData {
	Id?: number;
	Name: string;
	Summary?: string;
	Notes?: string;
	Characters: ICharacterData[];
	Encounters: IEncounterData[];
}
