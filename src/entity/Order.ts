import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'order_id', type: 'varchar', length: 100 })
    orderId: string

    @Column()
    status: boolean
}