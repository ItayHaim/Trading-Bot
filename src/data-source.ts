import "reflect-metadata"
import { DataSource } from "typeorm"
import { CandleStick } from "./entity/CandleStick"
import { Order } from "./entity/Order"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "z10mz10m",
    database: "trading_bot",
    synchronize: true,
    logging: false,
    entities: [CandleStick,Order],
    dropSchema: true,
    migrations: [],
    subscribers: [],
})
