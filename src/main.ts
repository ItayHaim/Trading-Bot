import { CurrenciesArray } from "./consts";
import { AppDataSource } from "./data-source";
import { CandleStick } from "./entity/CandleStick";
import { Currency } from "./entity/Currency";
import { addOneCandle } from "./functions/DataBaseOperations";
import { getCoinOHLCV } from "./operations/exchangeOperations";
import { strategyExample } from "./strategies/strategyExample";

export const main = async () => {
    try {
        setTimeout(async () => {
            setTimeout(async () => {
                addOneCandle()
            })
            strategyExample()
        }, 1000 * 6)

    } catch (err) {
        console.log(err);
        AppDataSource.destroy()
    }
}
