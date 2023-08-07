import "reflect-metadata"
import { DataSource } from "typeorm"
import { CandleStick } from "./entity/CandleStick"
import { Currency } from "./entity/Currency"
import { MainOrder } from "./entity/MainOrder"
import { SideOrder } from "./entity/SideOrder"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "z10mz10m",
    database: "trading_bot",
    synchronize: true,
    logging: false,
    entities: [Currency, CandleStick, MainOrder, SideOrder],
    dropSchema: true,
    migrations: [],
    subscribers: [],
})
