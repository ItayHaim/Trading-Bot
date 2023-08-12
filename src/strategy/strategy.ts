import { AppDataSource } from "../data-source";
import { CandleStick } from "../entity/CandleStick";
import { Currency } from "../entity/Currency";
import { IndicatorService } from "../service/indicator.service";

export const strategy = async () => {
    try {
        const indicatorService = new IndicatorService()
        const currencies = await AppDataSource.manager.find(Currency)

        for (const currency in currencies) {
            const symbol = currencies[currency]

            const candles = await AppDataSource.manager.find(CandleStick, {
                where: { currency: symbol },
                select: { closed: true }
            })

            const closedPrices = candles.map(candle => Number(candle.closed));
            const res = indicatorService.checkAllIndicators(closedPrices, symbol.symbol)
            console.log(res);
        }
        console.log('End strategy');
    } catch (err) {
        console.log('Strategy Failed: ' + err);
    }
}