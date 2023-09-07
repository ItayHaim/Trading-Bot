import { AppDataSource } from "../data-source"
import { CandleStick } from "../entity/CandleStick"
import { Currency } from "../entity/Currency"
import { getCoinOHLCV } from "../operation/exchangeOperations"

export class CandleStickService {
    private timeFrame = process.env.TIME_FRAME

    async addOneCandle(): Promise<void> {
        try {
            const currencies = await AppDataSource.manager.find(Currency)

            const promises = currencies.map(async (currency) => {
                const oneOHLCV = (await getCoinOHLCV(currency.symbol, this.timeFrame, undefined, 1))[0]
                return {
                    currency: currency,
                    date: new Date(oneOHLCV[0]),
                    open: oneOHLCV[1],
                    high: oneOHLCV[2],
                    low: oneOHLCV[3],
                    closed: oneOHLCV[4],
                    volume: oneOHLCV[5]
                }
            });

            const candlesArray = await Promise.all(promises);

            await AppDataSource.manager.save(CandleStick, candlesArray)
            console.log('Added on candle!');
        } catch (err) {
            console.error('Failed to add one candle: ' + err)
            throw err
        }
    }
}
