import {Entity, Column, Index, PrimaryGeneratedColumn, BaseEntity} from "typeorm";

@Entity()
export class Condition extends BaseEntity {

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
}