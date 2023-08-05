import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Order } from "./Order"

@Entity()
export class Currency {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar',length: 20})
    symbol: string
}