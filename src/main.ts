import { CurrenciesArray } from "./consts";
import { AppDataSource } from "./data-source";
import { addOneCandle, checkOrders } from "./functions/DataBaseOperations";
import { strategy } from "./strategies/strategy";

export const main = async () => {
    try {
        setInterval(async () => {
            addOneCandle()
        }, 1000 * 60 * 5) // 5 minutes
        setInterval(async () => {
            checkOrders()
        }, 1000 * 5) // 5 seconds


        strategy()
    } catch (err) {
        console.log(err);
        AppDataSource.destroy()
    }
}
