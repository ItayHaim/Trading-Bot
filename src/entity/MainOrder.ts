import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { BuyOrSell, OrderStatus } from "../enums"
import { Currency } from "./Currency"
import { SideOrder } from "./SideOrder"

@Entity()
export class MainOrder {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'order_id', type: 'varchar', length: 30 })
    orderId: string

    @Column({ type: 'enum', enum: BuyOrSell })
    buyOrSell: BuyOrSell

    @Column({ type: 'decimal', precision: 25, scale: 15 })
    amount: number

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Open })
    status: OrderStatus

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date

    @ManyToOne(() => Currency, (currency) => currency.id)
    @JoinColumn({ name: "currency_id" })
    currency: Currency

    @OneToMany(() => SideOrder, (sideOrder) => sideOrder.mainOrder, { cascade: true, onDelete: 'CASCADE' })
    sideOrders: SideOrder[]
}