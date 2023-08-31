import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Crosses } from "../enums";

@Entity()
export class Cross {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    crossType: Crosses
}