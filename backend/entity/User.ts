import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Encounter, IEncounterData } from "./Encounter";

export interface IUserData {
	Email: string;

	Username: string;
	Name: string;
	HashedPassword: string;
	Type: string;
	
    CreatedEncounters: IEncounterData[];
}

@Entity()
export class User extends BaseEntity implements IUserData {

	@PrimaryGeneratedColumn()
	Id: number;

	@Column({
		type: 'varchar',
		unique: true
	})
	Email: string;

	@Column({
		type: 'varchar',
		unique: true
	})
	Username: string;

	@Column({ type: 'varchar' })
	Name: string;

	@Column({ type: 'varchar' })
	HashedPassword: string;

	@Column({ type: 'varchar' })
	Type: string;
	
	@OneToMany(() => Encounter, encounter => encounter.Creator)
    CreatedEncounters: Encounter[];

}