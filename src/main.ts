import { SymbolsArray } from "./consts";
import { AppDataSource } from "./data-source";
import { CandleStick } from "./entity/CandleStick";
import { Currency } from "./entity/Currency";
import { getCoinOHLCV } from "./operations/exchangeOperations";
import { strategyExample } from "./strategies/strategyExample";

export const main = async () => {
    try {
        for (const symbol in SymbolsArray) {
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
        strategyExample()
    } catch (err) {
        console.log(err);
    }
}
