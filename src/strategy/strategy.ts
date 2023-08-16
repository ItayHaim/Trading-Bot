import { AppDataSource } from "../data-source";
import { CandleStick } from "../entity/CandleStick";
import { Currency } from "../entity/Currency";
import { IndicatorService } from "../service/indicator.service";

export const strategy = async () => {
    try {
        const indicatorService = new IndicatorService()

        // Get all currencies and run the indicator on each currency
        const currencies = await AppDataSource.manager.find(Currency)
        for (const index in currencies) {
            const currency = currencies[index]

            const candles = await AppDataSource.manager.find(CandleStick, {
                where: { currency: currency },
                select: { closed: true }
            })
            const closedPrices = candles.map(candle => Number(candle.closed));

            indicatorService.checkAllIndicators(closedPrices, currency)
        }
        console.log('End strategy');
    } catch (err) {
        console.log('Strategy Failed: ' + err);
    }
}