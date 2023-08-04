import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Currency } from "./Currency"

@Entity()
export class CandleStick {
    @PrimaryGeneratedColumn()
    id: number

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

    @ManyToOne(() => Currency, (currency) => currency.id)
    @JoinColumn({ name: 'symbol_id' })
    symbolId: number
}