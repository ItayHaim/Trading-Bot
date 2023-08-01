import { AppDataSource } from "./data-source"
import { CandleStick } from "./entity/CandleStick";
import { getCoinOHLCV } from "./operations/exchangeOperations"

AppDataSource.initialize().then(async () => { 
    const symbol = 'BTC/USDT'
    const timeFrame = '5m'

    const OHLCV = await getCoinOHLCV(symbol, timeFrame)
    for await (const candle of OHLCV) {
        let candleStick = AppDataSource.manager.create(CandleStick, {
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
    setInterval(async () => {
        const candle = await getCoinOHLCV(symbol, timeFrame, undefined, 1)
        await AppDataSource.manager.save(candle)
    }, 60 * 1000) // every 5 minutes
}).catch(error => console.log(error))
