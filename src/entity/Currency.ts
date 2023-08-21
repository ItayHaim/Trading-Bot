import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Currency {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 12 })
    symbol: string
}