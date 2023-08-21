import { CurrenciesArray } from "./currencies";
import { AppDataSource } from "./data-source";
import { CandleStick } from "./entity/CandleStick";
import { Currency } from "./entity/Currency";
import { MainOrder } from "./entity/MainOrder";
import { SideOrder } from "./entity/SideOrder";
import { main } from "./main";
import { changeLeverage, changeToIsolated, getCoinOHLCV } from "./operation/exchangeOperations";


AppDataSource.initialize().then(async () => {
    try {
        const timeFrame = process.env.TIME_FRAME
        const leverage = Number(process.env.LEVERAGE)
        const candleAmount = Number(process.env.CANDLE_AMOUNT)

        // Deleting data from currency, candlestick and sid orders tables
        AppDataSource.getRepository(MainOrder).update({}, {
            currency: null
        })
        await AppDataSource.getRepository(CandleStick).delete({})
        await AppDataSource.getRepository(Currency).delete({})
        await AppDataSource.getRepository(SideOrder).delete({})

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
        console.error('Failed to connect or initialize: ' + err);
        AppDataSource.destroy()
    }
}).catch(error => console.error(error))
