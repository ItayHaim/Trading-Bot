import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Currency } from "./Currency"

@Entity()
export class CandleStick {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    date: Date

    @Column({ type: 'decimal', precision: 18, scale: 8 })
    open: number

    @Column({ type: 'decimal', precision: 18, scale: 8 })
    high: number

    @Column({ type: 'decimal', precision: 18, scale: 8 })
    low: number

    @Column({ type: 'decimal', precision: 18, scale: 8 })
    closed: number

    @Column({ type: 'decimal', precision: 18, scale: 8 })
    volume: number

    @ManyToOne(() => Currency, (currency) => currency.id)
    @JoinColumn({ name: "currency_id" })
    currency: Currency
}