import { AppDataSource } from "../data-source"
import { CandleStick } from "../entity/CandleStick"
import { Currency } from "../entity/Currency"
import { IndicatorService } from "../service/indicator.service"
import { StrategyService } from "../service/strategy.service"

export const linearRegressionStrategy = async () => {
    try {
        const strategyService = new StrategyService()
        const indicatorService = new IndicatorService()

        const currencies = await AppDataSource.manager.find(Currency)
        for (const index in currencies) {
            const currency = currencies[index]

            const candles = await AppDataSource.manager.find(CandleStick, {
                where: { currency: currency },
                select: { closed: true }
            })
            const closedPrices = candles.map(candle => Number(candle.closed))

            const res = await indicatorService.checkLinearRegression(closedPrices, currency)
        }
        // await strategyService.MACrossesStrategy(waitingOrders)

        console.log('End strategy')
    } catch (err) {
        console.error('Linear regression strategy Failed: ' + err)
        throw err
    }
}