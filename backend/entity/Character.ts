import { Entity, Column, Index, PrimaryGeneratedColumn, ManyToOne, ManyToMany, BaseEntity } from "typeorm";
import { CharacterRace, CharacterClass } from "./CharacterEnums";
import { Campaign, ICampaignData } from "./Campaign";
import { User, IUserData } from "./User";

export interface ICharacterData {
    Creator: IUserData;

    Id: number;
    Name: string,
    Level: number,
    Race: CharacterRace,
    Class: CharacterClass,
    MaxHealth: number,
    ArmorClass: number,
    Notes: string,

    Campaigns: ICampaignData[];
}

@Entity()
export class Character extends BaseEntity implements ICharacterData {
    @PrimaryGeneratedColumn()
    Id: number;

    @ManyToOne(() => User, user => user.CreatedCharacters)
    Creator: User;

    @Index()
    @Column({
        type: "varchar",
        length: 50
    })
    Name: string;

    @Column({
        type: "int",
        default: 1
    })
    Level: number;

    @Column({
        type: "enum",
        enum: CharacterRace,
        default: CharacterRace.Human
    })
    Race: CharacterRace;

    @Column({
        type: "enum",
        enum: CharacterClass,
        default: CharacterClass.Fighter
    })
    Class: CharacterClass;

    
    @Column({
        type: "int",
        default: 20
    })
    MaxHealth: number;

    @Column({
        type: "int",
        default: 12
    })
    ArmorClass: number;

    @Column({
        type: "varchar",
        length: 1000
    })
    Notes: string;

    @ManyToMany(() => Campaign, campaign => campaign.Characters)
    Campaigns: Campaign[];
}