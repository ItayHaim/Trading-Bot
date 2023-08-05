import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Currency } from "./Currency"
import { OrderStatus, OrderType } from "../enums"

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'order_id', type: 'varchar', length: 100 })
    orderId: string

    @Column({ type: 'enum', enum: OrderType })
    orderType: OrderType

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Open })
    status: OrderStatus

    @ManyToOne(() => Currency, (currency) => currency.id)
    @JoinColumn({ name: "symbol_id" })
    symbol: Currency
}