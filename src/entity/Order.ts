import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { OrderStatus } from "../consts"
import { Currency } from "./Currency"

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'order_id', type: 'varchar', length: 100 })
    orderId: string

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Open })
    status: OrderStatus

    @ManyToOne(() => Currency, (currency) => currency.id)
    @JoinColumn({ name: "symbol_id" })
    symbolId: Currency
}