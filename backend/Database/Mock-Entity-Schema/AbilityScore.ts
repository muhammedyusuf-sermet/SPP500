import {Entity, Column, Index, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class AbilityScore {

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
        length: 3
    })
    Abbreviation: string;

    @Column({
        type: "varchar",
        length: 500
    })
    Description: string;

}