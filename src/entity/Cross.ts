import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Crosses, SMACrossTypes } from "../enums";

@Entity()
export class Cross {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'enum', enum: Crosses })
    crossType: Crosses

    @Column({ type: 'enum', enum: SMACrossTypes })
    SMACrossTypes: SMACrossTypes
}