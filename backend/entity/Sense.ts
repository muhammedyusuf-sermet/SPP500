/*"127","darkvision  ft passive Perception "
"95","passive Perception "
"47","blindsight  ft darkvision  ft passive Perception "
"25","blindsight  ft passive Perception "
"13","truesight  ft passive Perception "
"10","blindsight  ft blind beyond this radius passive Perception "
"5","darkvision  ft tremorsense  ft passive Perception "
"1","blindsight  ft or  ft while deafened blind beyond this radius passive Perception "
"1","darkvision  ft rat form only passive Perception "
"1","blindsight  ft tremorsense  ft passive Perception "*/
import { Entity, Column, Index, PrimaryGeneratedColumn, BaseEntity, OneToMany } from "typeorm";
import { IMonsterSenseData, MonsterSense } from "./MonsterSense";

export interface ISenseData {
    Name: string;
    Description: string;

    Monsters: IMonsterSenseData[];
}

@Entity()
export class Sense extends BaseEntity {

    @PrimaryGeneratedColumn()
    Id: number;

    @Index()
    @Column({
        type: "varchar",
        length: 50
    })
    Name: string;

    @Column({
        type: "varchar",
        length: 500
    })
	Description: string;
	
	@OneToMany(() => MonsterSense, monsterSense => monsterSense.Sense)
    Monsters: MonsterSense[];
}