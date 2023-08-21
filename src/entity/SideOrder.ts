import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { OrderStatus, OrderType } from "../enums"
import { MainOrder } from "./MainOrder"

@Entity()
export class SideOrder {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'order_id', type: 'varchar', length: 30 })
    orderId: string

    @Column({ type: 'enum', enum: OrderType })
    orderType: OrderType

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Open })
    status: OrderStatus

    @ManyToOne(() => MainOrder, (mainOrder) => mainOrder.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "main_order_id" })
    mainOrder: MainOrder
}