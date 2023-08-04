import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Currency } from "./Currency"

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'order_id', type: 'varchar', length: 100 })
    orderId: string

    @Column()
    status: boolean

    @ManyToOne(() => Currency, (currency) => currency.id)
    @JoinColumn({ name: 'symbol_id' })
    symbolId: number
}