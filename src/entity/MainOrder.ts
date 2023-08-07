import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { BuyOrSell, OrderStatus } from "../enums"
import { Currency } from "./Currency"

@Entity()
export class MainOrder {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'order_id', type: 'varchar', length: 100 })
    orderId: string

    @Column({ type: 'enum', enum: BuyOrSell })
    buyOrSell: BuyOrSell

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Open })
    status: OrderStatus

    @ManyToOne(() => Currency, (currency) => currency.id)
    @JoinColumn({ name: "currency_id" })
    currency: Currency
}