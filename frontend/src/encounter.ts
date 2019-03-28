import * as Monster from "./monster";

export interface IEncounterState {
	Id?: string,
	Name: string,
	Description: string;
	Monsters: Monster.IMonsterState[];
}
