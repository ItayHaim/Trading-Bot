import { CurrenciesArray } from "./consts";
import { AppDataSource } from "./data-source";
import { addOneCandle } from "./functions/DataBaseOperations";
import { strategy } from "./strategies/strategy";

export const main = async () => {
    try {
        setInterval(async () => {
            addOneCandle()
        }, 1000 * 60 * 5) // 5 minutes
        strategy()
    } catch (err) {
        console.log(err);
        AppDataSource.destroy()
    }
}
