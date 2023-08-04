import { CurrenciesArray } from "./consts";
import { AppDataSource } from "./data-source"
import { CandleStick } from "./entity/CandleStick";
import { Currency } from "./entity/Currency";
import { main } from "./main";
import { getCoinOHLCV } from "./operations/exchangeOperations";

AppDataSource.initialize().then(async () => {
    // First initialize the last 500 candles
    try {
        const timeFrame = process.env.TIME_FRAME

        for (const coinPair in CurrenciesArray) {
            const symbol = CurrenciesArray[coinPair]

            const { id } = await AppDataSource.manager.save(Currency, {
                symbol: symbol
            })

            const OHLCV = await getCoinOHLCV(symbol, timeFrame, undefined, 100)
            for await (const candle of OHLCV) {
                await AppDataSource.manager.save(CandleStick, {
                    symbolId: id,
                    date: new Date(candle[0]),
                    open: candle[1],
                    high: candle[2],
                    low: candle[3],
                    closed: candle[4],
                    volume: candle[5]
                });
            }
        }
        // Run the trading strategy
        console.log('Connect and initialize ')
        main()
    } catch (err) {
        console.log(err);
        AppDataSource.destroy()
    }
}).catch(error => console.log(error))
