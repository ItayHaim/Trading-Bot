import { currenciesArray } from "./consts";
import { AppDataSource } from "./data-source"
import { CandleStick } from "./entity/CandleStick";
import { main } from "./main";
import { getCoinOHLCV } from "./operations/exchangeOperations";

AppDataSource.initialize().then(async () => {
    // First initialize the last 500 candles
    try {
        const timeFrame = process.env.TIME_FRAME
        for (const currency in currenciesArray) {
            const { symbol, symbolId } = currenciesArray[currency];

            const OHLCV = await getCoinOHLCV(symbol, timeFrame, undefined, 500)
            for await (const candle of OHLCV) {
                let candleStick = AppDataSource.manager.create(CandleStick, {
                    symbolId: symbolId,
                    symbol: symbol,
                    date: new Date(candle[0]),
                    open: candle[1],
                    high: candle[2],
                    low: candle[3],
                    closed: candle[4],
                    volume: candle[5]
                });

                await AppDataSource.manager.save(candleStick);
            }

            // Run the trading strategy
            main()
        }
    } catch (err) {
        console.log(err);
    }
}).catch(error => console.log(error))
