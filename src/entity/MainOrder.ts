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

    @Column({ type: 'timestamp', name: 'closed_at', nullable: true })
    closedAt: Date

    @Column({ type: 'varchar', length: 12 })
    symbol: string

    @Column({ type: 'decimal', precision: 25, scale: 15, nullable: true })
    pnl: number

    @ManyToOne(() => Currency, (currency) => currency.id, { nullable: true })
    @JoinColumn({ name: "currency_id" })
    currency: Currency

    @OneToMany(() => SideOrder, (sideOrder) => sideOrder.mainOrder, { cascade: true, onDelete: 'CASCADE' })
    sideOrders: SideOrder[]
}