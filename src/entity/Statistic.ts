import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Statistic {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    success: number

    @Column()
    failed: number
}