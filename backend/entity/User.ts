import {BaseEntity, Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        unique: true
    })
    email: string;

    @Column({
        type: 'varchar',
        unique: true
    })
    username: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    hashed_password: string;

    @Column({ type: 'varchar' })
    type: string;

}