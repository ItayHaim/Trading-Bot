import { CurrenciesArray } from "../consts"
import { AppDataSource } from "../data-source"
import { CandleStick } from "../entity/CandleStick"
import { Currency } from "../entity/Currency"
import { getCoinOHLCV } from "../operations/exchangeOperations"

export const addOneCandle = async () => {
    const timeFrame = process.env.TIME_FRAME

    for (const coinPair in CurrenciesArray) {
        const symbol = CurrenciesArray[coinPair]

        const currency = await AppDataSource.manager.findOneOrFail(Currency, {
            where: { symbol: symbol }
        })

        const oneOHLCV = (await getCoinOHLCV(symbol, timeFrame, undefined, 1))[0]

        await AppDataSource.manager.save(CandleStick, {
            symbol: currency,
            date: new Date(oneOHLCV[0]),
            open: oneOHLCV[1],
            high: oneOHLCV[2],
            low: oneOHLCV[3],
            closed: oneOHLCV[4],
            volume: oneOHLCV[5]
        })
    }
    console.log('Added on candle!');
}