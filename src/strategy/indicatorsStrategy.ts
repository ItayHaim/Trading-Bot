import { AppDataSource } from "../data-source";
import { CandleStick } from "../entity/CandleStick";
import { Currency } from "../entity/Currency";
import { StrategyService } from "../service/strategy.service";

export const indicatorsStrategy = async () => {
    try {
        const strategyService = new StrategyService()

        // Get all currencies and run the indicator on each currency
        const currencies = await AppDataSource.manager.find(Currency)
        for (const index in currencies) {
            const currency = currencies[index]

            const candles = await AppDataSource.manager.find(CandleStick, {
                where: { currency: currency },
                select: { closed: true },
                order: { date: 'DESC' },
                take: 100
            })
            const closedPrices = candles.map(candle => Number(candle.closed));

            await strategyService.indicatorsStrategy(closedPrices, currency)
        }
        console.log('End strategy');
    } catch (err) {
        console.error('Indicator strategy Failed: ' + err)
        throw err
    }
}