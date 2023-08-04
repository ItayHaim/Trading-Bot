import { CurrenciesArray } from "./consts";
import { AppDataSource } from "./data-source";
import { CandleStick } from "./entity/CandleStick";
import { Currency } from "./entity/Currency";
import { getCoinOHLCV } from "./operations/exchangeOperations";

export const main = async () => {
    try {
        const timeFrame = process.env.TIME_FRAME

        for (const currency in CurrenciesArray) {
            const symbol = CurrenciesArray[currency]

            const { id } = await AppDataSource.manager.findOneOrFail(Currency, {
                where: { symbol: symbol }
            })

            const oneOHLCV = await getCoinOHLCV(symbol, timeFrame, undefined, 1)
            
            await AppDataSource.manager.save(CandleStick, {
                symbolId: id,
                date: new Date(oneOHLCV[0][0]),
                open: oneOHLCV[0][1],
                high: oneOHLCV[0][2],
                low: oneOHLCV[0][3],
                closed: oneOHLCV[0][4],
                volume: oneOHLCV[0][5]
            })
        }
        console.log('Added on candle!');

        // strategyExample()
    } catch (err) {
        console.log(err);
        AppDataSource.destroy()
    }
}
