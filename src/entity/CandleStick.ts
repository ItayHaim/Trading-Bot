import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Currency } from "./Currency"

@Entity()
export class CandleStick {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Currency, (currency) => currency.symbolId)
    @JoinColumn({ name: 'symbol_id' })
    symbolId: number

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