import { CurrenciesArray } from "./currencies";
import { AppDataSource } from "./data-source";
import { CandleStick } from "./entity/CandleStick";
import { Currency } from "./entity/Currency";
import { main } from "./main";
import { changeLeverage, changeToIsolated, getCoinOHLCV } from "./operation/exchangeOperations";


AppDataSource.initialize().then(async () => {
    try {
        const timeFrame = process.env.TIME_FRAME
        const leverage = Number(process.env.LEVERAGE)
        const candleAmount = Number(process.env.CANDLE_AMOUNT)

        await AppDataSource.createQueryRunner()
            .dropTable('currency')
        await AppDataSource.createQueryRunner()
            .dropTable('candlestick')

        // First initialize all the currencies and save them and their candlesticks in DB
        for (const index in CurrenciesArray) {
            const symbol = CurrenciesArray[index]

            const currency = await AppDataSource.manager.save(Currency, {
                symbol: symbol
            })

            // Change currency to isolated and change his leverage
            await changeLeverage(leverage, currency.symbol)
            await changeToIsolated(currency.symbol)

            const OHLCV = await getCoinOHLCV(symbol, timeFrame, undefined, candleAmount)
            for (const candle of OHLCV) {
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
        console.log('Failed to connect or initialize: ' + err);
        AppDataSource.destroy()
    }
}).catch(error => console.log(error))
