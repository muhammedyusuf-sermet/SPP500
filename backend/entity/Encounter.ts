import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, BaseEntity, JoinTable, ManyToOne } from "typeorm";
import { Monster, IMonsterData } from "./Monster";
import { User, IUserData } from "./User";

export interface IEncounterData {
    Creator: IUserData;
    Name: string;
    Description: string;

    Monsters: IMonsterData[];
}

@Entity()
export class Encounter extends BaseEntity implements IEncounterData {

    @PrimaryGeneratedColumn()
    Id: number;

    @ManyToOne(() => User, user => user.CreatedEncounters)
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
    Description: string;

    @ManyToMany(() => Monster, monster => monster.Encounters)
    @JoinTable()
    Monsters: Monster[];
}