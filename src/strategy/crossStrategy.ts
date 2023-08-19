import { AppDataSource } from "../data-source";
import { CandleStick } from "../entity/CandleStick";
import { Currency } from "../entity/Currency";
import { CrossIndicator } from "../enums";
import { IndicatorService } from "../service/indicator.service";
import { StrategyService } from "../service/strategy.service";

export const crossStrategy = async () => {
    try {
        const strategyService = new StrategyService()

        // Get all currencies and run the indicator on each currency
        const currencies = await AppDataSource.manager.find(Currency)
        for (const index in currencies) {
            const currency = currencies[index]

            const candles = await AppDataSource.manager.find(CandleStick, {
                where: { currency: currency },
                select: { closed: true }
            })
            const closedPrices = candles.map(candle => Number(candle.closed));

            // await strategyService.crossesStrategy(closedPrices,CrossIndicator.SMA,currency)
            await strategyService.crossesStrategy(closedPrices,CrossIndicator.MACD,currency)
        }
        console.log('End strategy');
    } catch (err) {
        console.log('Strategy Failed: ' + err);
    }
}