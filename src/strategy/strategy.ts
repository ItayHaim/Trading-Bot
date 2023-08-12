import { AppDataSource } from "../data-source";
import { CandleStick } from "../entity/CandleStick";
import { Currency } from "../entity/Currency";
import { IndicatorService } from "../service/indicator.service";
// setConfig('precision', 15)

export const strategy = async () => {
    try {
        const indicatorService = new IndicatorService()
        const currencies = await AppDataSource.manager.find(Currency)

        for (const currency in currencies) {
            const symbol = currencies[currency]
            console.log(symbol);

            const candles = await AppDataSource.manager.find(CandleStick, {
                where: { currency: symbol },
                select: { closed: true }
            })
            const closedPrices = candles.map(candle => Number(candle.closed));

            // const SMA = calculateSMA(closedPrices)
            // console.log('SMA: ', SMA);

            indicatorService.checkBolingerBands(closedPrices)


            // if (RSI && stochasticRSI && MACD && SMA && bollingerBands) {

            // }

        }

    } catch (err) {
        console.log('Strategy Failed: ' + err);
    }
}