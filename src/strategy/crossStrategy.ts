import { AppDataSource } from "../data-source";
import { CandleStick } from "../entity/CandleStick";
import { Currency } from "../entity/Currency";
import { CrossIndicator } from "../enums";
import { WaitingCrossesArrayType } from "../types";
import { IndicatorService } from "../service/indicator.service";
import { StrategyService } from "../service/strategy.service";

export const crossStrategy = async () => {
    try {
        const strategyService = new StrategyService()
        const indicatorService = new IndicatorService()
        const waitingOrders: WaitingCrossesArrayType[] = []

        // Get all currencies and run the indicator on each currency
        const currencies = await AppDataSource.manager.find(Currency)
        for (const index in currencies) {
            const currency = currencies[index]

            const candles = await AppDataSource.manager.find(CandleStick, {
                where: { currency: currency },
                select: { closed: true }
            })
            const closedPrices = candles.map(candle => Number(candle.closed));

            //! If using the SMA cross indicator must change candles amount in .env to 200! 
            // await strategyService.crossesStrategy(closedPrices,CrossIndicator.SMA,currency)
            const result = await indicatorService.checkCrossesAndBB(closedPrices, CrossIndicator.MACD, currency)
            if (result) {
                waitingOrders.push(result)
            }
        }

        await strategyService.crossesAndBBStrategy(waitingOrders)

        console.log('End strategy');
    } catch (err) {
        console.log('Strategy Failed: ' + err);
    }
}