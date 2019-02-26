import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, BaseEntity, JoinTable, ManyToOne} from "typeorm";
import { Monster } from "./Monster";
import { User } from "./User";

@Entity()
export class Encounter extends BaseEntity {

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