import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, BaseEntity, JoinTable, ManyToOne } from "typeorm";
import { Encounter, IEncounterData } from "./Encounter";
import { User, IUserData } from "./User";

export interface ICampaignData {
    Creator: IUserData;
    Name: string;
    Summary?: string;
    Notes?: string;
    Encounters?: IEncounterData[];
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
        length: 1000
    })
    Summary: string;

    @Column({
        type: "varchar",
        length: 2000
    })
    Notes: string;

    @ManyToMany(() => Encounter, encounter => encounter.Campaigns)
    @JoinTable()
    Encounters: Encounter[];
}