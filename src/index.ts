import { CurrenciesArray } from "./currencies";
import { AppDataSource } from "./data-source";
import { CandleStick } from "./entity/CandleStick";
import { Currency } from "./entity/Currency";
import { MainOrder } from "./entity/MainOrder";
import { SideOrder } from "./entity/SideOrder";
import { main } from "./main";
import { getCoinOHLCV } from "./operation/exchangeOperations";

// Access environment variables once
const timeFrame = process.env.TIME_FRAME;
const leverage = Number(process.env.LEVERAGE);
const candleAmount = Number(process.env.CANDLE_AMOUNT);

AppDataSource.initialize().then(async () => {
    try {
        // Deleting data from currency, candlestick and sid orders tables
        await AppDataSource.getRepository(MainOrder).update({}, {
            currency: null
        });
        await AppDataSource.getRepository(CandleStick).delete({});
        await AppDataSource.getRepository(Currency).delete({});
        await AppDataSource.getRepository(SideOrder).delete({});

        // First initialize all the currencies and save them and their candlesticks in DB
        const promises = CurrenciesArray.map(async (symbol) => {
            const currency = await AppDataSource.manager.save(Currency, {
                symbol: symbol
            });

            // Change currency to isolated and change his leverage
            //! Active when first use
            // await changeLeverage(leverage, currency.symbol)
            // await changeToIsolated(currency.symbol)

            const OHLCV = await getCoinOHLCV(symbol, timeFrame, undefined, candleAmount);
            return OHLCV.map(candle => ({
                currency: currency,
                date: new Date(candle[0]),
                open: candle[1],
                high: candle[2],
                low: candle[3],
                closed: candle[4],
                volume: candle[5]
            }));
        });

        const candlesArray = (await Promise.all(promises)).flat();
        await AppDataSource.manager.save(CandleStick, candlesArray);

        console.log('Connect and initialize ');
        // Run the trading strategy
        main();
    } catch (err) {
        console.error('Failed to connect or initialize: ' + err);
        AppDataSource.destroy();
    }
}).catch(error => console.error(error));
