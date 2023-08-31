import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Currency } from "./Currency"
import { Cross } from "./Cross"

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

    @OneToOne(() => Cross, (cross) => cross.id)
    @JoinColumn({ name: "cross_id" })
    cross: Cross

    @ManyToOne(() => Currency, (currency) => currency.id)
    @JoinColumn({ name: "currency_id" })
    currency: Currency
}