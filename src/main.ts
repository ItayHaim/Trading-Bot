import { AppDataSource } from "./data-source";
import { addOneCandle, checkOrders } from "./function/DataBaseOperations";
import { strategy } from "./strategy/strategy";

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
