import { IMonsterData } from "./monster";

export interface IEncounterData {
	Id?: number,
	Name: string,
	Description?: string;
	Monsters?: IMonsterData[];
}
