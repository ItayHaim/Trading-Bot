import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class CandleStick {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar',length: 20})
    symbol: string

    @Column()
    date: Date

    @Column()
    open: number

    @Column()
    high: number

    @Column()
    low: number

    @Column()
    closed: number

    @Column()
    volume: number

}