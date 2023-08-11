import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Currency } from "./Currency"

@Entity()
export class CandleStick {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    date: Date

    @Column({ type: 'decimal', precision: 5, scale: 5 })
    open: number

    @Column({ type: 'decimal', precision: 5, scale: 5 })
    high: number

    @Column({ type: 'decimal', precision: 5, scale: 5 })
    low: number

    @Column({ type: 'decimal', precision: 5, scale: 5 })
    closed: number

    @Column({ type: 'decimal', precision: 5, scale: 5 })
    volume: number

    @ManyToOne(() => Currency, (currency) => currency.id)
    @JoinColumn({ name: "currency_id" })
    currency: Currency
}