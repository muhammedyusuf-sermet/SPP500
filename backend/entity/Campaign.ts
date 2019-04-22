import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, BaseEntity, JoinTable, ManyToOne } from "typeorm";
import { Encounter, IEncounterData } from "./Encounter";
import { User, IUserData } from "./User";
import { Character, ICharacterData } from "./Character";

export interface ICampaignData {
    Creator: IUserData;

    Id: number;
    Name: string;
    Summary?: string;
    Notes?: string;

    Encounters: IEncounterData[];
    Characters: ICharacterData[];
}

@Entity()
export class Campaign extends BaseEntity implements ICampaignData {

    @PrimaryGeneratedColumn()
    Id: number;

    @ManyToOne(() => User, user => user.CreatedCampaigns)
    Creator: User;

    @Column({
        type: "varchar",
        length: 50
    })
    Name: string;

    @Column({
        type: "varchar",
        length: 1000,
        nullable: true
    })
    Summary: string;

    @Column({
        type: "varchar",
        length: 2000,
        nullable: true
    })
    Notes: string;

    @ManyToMany(() => Encounter, encounter => encounter.Campaigns)
    @JoinTable()
    Encounters: Encounter[];

    @ManyToMany(() => Character, character => character.Campaigns)
    @JoinTable()
    Characters: Character[];
}