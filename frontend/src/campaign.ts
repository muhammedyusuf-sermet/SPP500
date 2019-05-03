import { IEncounterData } from "./encounter";
import { ICharacterData } from "./character";

export interface ICampaignData {
	Id?: number,
	Name: string,
	Summary?: string;
	Notes?: string;
	Encounters?: (IEncounterData | { Id?: number })[];
	Characters?: (ICharacterData | { Id?: number })[];
}
