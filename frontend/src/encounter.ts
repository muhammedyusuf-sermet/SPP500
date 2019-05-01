import { IMonsterData } from "./monster";

export interface IEncounterData {
	Id?: string,
	Name: string,
	Description: string;
	Monsters: IMonsterData[];
}
