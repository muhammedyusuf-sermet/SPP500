import {Entity, Column, Index, PrimaryGeneratedColumn, BaseEntity} from "typeorm";

export enum SpellComponents {
    Verbal = "Verbal",
    Somatic = "Somatic",
    Material = "Material"
}

@Entity()
export class Spell extends BaseEntity {

    @PrimaryGeneratedColumn()
    Id: number;

    @Index()
    @Column({
        type: "varchar",
        length: 50,
    })
    Name: string;

    @Column({
        type: "int",
        default: 1
    })
    Level: number;

    @Column({
        type: "varchar",
        length: 50,
        default: "1 action"
    })
    CastingTime: string;

    @Column({
        type: "varchar",
        length: 50,
        default: "60 feet"
    })
    Range: string;

    @Column({
        type: "enum",
        enum: SpellComponents,
        array: true
    })
    Components: SpellComponents[];

    @Column({
        type: "varchar",
        length: 250
    })
    Material: string;

    @Column({
        type: "varchar",
        length: 50
    })
    Duration: string;

    @Column({
        type: "text",
        array: true
    })
    Description: string[];

    @Column({
        type: "text"
    })
    HigherLevel: string;

    @Column({
        type: "varchar",
        length: 50
    })
    School: string;
}