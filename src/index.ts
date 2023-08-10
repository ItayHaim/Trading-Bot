import { CurrenciesArray } from "./consts";
import { AppDataSource } from "./data-source";
import { CandleStick } from "./entity/CandleStick";
import { Currency } from "./entity/Currency";
import { main } from "./main";
import { changeLeverage, changeToIsolated, getCoinOHLCV } from "./operation/exchangeOperations";


AppDataSource.initialize().then(async () => {
    // First initialize the last 10 candles
    try {
        const timeFrame = process.env.TIME_FRAME
        const leverage = Number(process.env.LEVERAGE)
        const candleAmount = Number(process.env.CANDLE_AMOUNT)

        for (const coinPair in CurrenciesArray) {
            const symbol = CurrenciesArray[coinPair]

            const currency = await AppDataSource.manager.save(Currency, {
                symbol: symbol
            })
            await changeLeverage(leverage, currency.symbol)
            await changeToIsolated(currency.symbol)

            const OHLCV = await getCoinOHLCV(symbol, timeFrame, undefined, candleAmount)
            for await (const candle of OHLCV) {
                await AppDataSource.manager.save(CandleStick, {
                    currency: currency,
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
        console.log('Failed to connect or initialize');
        console.log(err);
        AppDataSource.destroy()
    }
}).catch(error => console.log(error))
