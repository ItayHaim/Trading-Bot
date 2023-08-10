import { CurrenciesArray } from "../consts"
import { AppDataSource } from "../data-source"
import { CandleStick } from "../entity/CandleStick"
import { Currency } from "../entity/Currency"
import { getCoinOHLCV } from "../operation/exchangeOperations"

export class CandleStickService {
    private timeFrame = process.env.TIME_FRAME

    async addOneCandle(): Promise<void> {
        for (const coinPair in CurrenciesArray) {
            const symbol = CurrenciesArray[coinPair]

            const currency = await AppDataSource.manager.findOneOrFail(Currency, {
                where: { symbol: symbol }
            })

            const oneOHLCV = (await getCoinOHLCV(symbol, this.timeFrame, undefined, 1))[0]

            await AppDataSource.manager.save(CandleStick, {
                currency: currency,
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

    async getCandleSticksBySymbolId(symbolId: number) {
        return await AppDataSource.manager.find(CandleStick, {
            where: { currency: { id: symbolId } }
        })
    }
}