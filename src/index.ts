import { AppDataSource } from "./data-source"
import { CandleStick } from "./entity/CandleStick";
import { getCoinOHLCV } from "./opertions/exchangeOperations"

AppDataSource.initialize().then(async () => {
    const OHLCV = await getCoinOHLCV('BTC/USDT', '5m')
    for await (const candle of OHLCV) {
        let candleStick = AppDataSource.manager.create(CandleStick, {
            date: new Date(candle[0]),
            open: candle[1],
            high: candle[2],
            low: candle[3],
            closed: candle[4],
            volume: candle[5]
        });

        await AppDataSource.manager.save(candleStick);
    }
    setInterval(() => {

    }, 5 * 60 * 100) // every 5 minutes
}).catch(error => console.log(error))
