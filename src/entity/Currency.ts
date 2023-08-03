import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Currency {

    @PrimaryGeneratedColumn()
    id: number

    @Column({name: 'symbol_id'})
    symbolId: number

    @Column({type: 'varchar',length: 20})
    symbol: string
}