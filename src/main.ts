import { CurrenciesArray } from "./consts";
import { AppDataSource } from "./data-source";
import { CandleStick } from "./entity/CandleStick";
import { Currency } from "./entity/Currency";
import { getCoinOHLCV } from "./operations/exchangeOperations";

export const main = async () => {
    try {
        for (const currency in CurrenciesArray) {
            const symbol = CurrenciesArray[currency]

            const { id } = await AppDataSource.manager.findOne(Currency, {
                where: { symbol: symbol }
            })
            console.log(id);

            const oneOHLCV = await getCoinOHLCV(symbol, process.env.TIME_FRAME, undefined, 1)[0]
            let candleStick = AppDataSource.manager.create(CandleStick, {
                symbolId: id,
                date: new Date(oneOHLCV[0]),
                open: oneOHLCV[1],
                high: oneOHLCV[2],
                low: oneOHLCV[3],
                closed: oneOHLCV[4],
                volume: oneOHLCV[5]
            })
            await AppDataSource.manager.save(candleStick)
        }
        console.log('finish');
        
        // strategyExample()
    } catch (err) {
        console.log(err);
    }
}
