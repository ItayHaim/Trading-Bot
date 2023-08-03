import { currenciesArray } from "./consts";
import { AppDataSource } from "./data-source";
import { CandleStick } from "./entity/CandleStick";
import { getCoinOHLCV } from "./operations/exchangeOperations";
import { strategyExample } from "./strategies/strategyExample";

export const main = async () => {
    try {
        setInterval(async () => {
            for (const currency in currenciesArray) {
                const { symbol, symbolId } = currenciesArray[currency];

                const oneOHLCV = await getCoinOHLCV(symbol, process.env.TIME_FRAME, undefined, 1)[0]
                let candleStick = AppDataSource.manager.create(CandleStick, {
                    symbolId: symbolId,
                    date: new Date(oneOHLCV[0]),
                    open: oneOHLCV[1],
                    high: oneOHLCV[2],
                    low: oneOHLCV[3],
                    closed: oneOHLCV[4],
                    volume: oneOHLCV[5]
                })
                await AppDataSource.manager.save(candleStick)
            }
            strategyExample()
        }, 60 * 1000) // Need to be the same as the process.env.TIME_FRAME

    } catch (err) {
        console.log(err);
    }
}
