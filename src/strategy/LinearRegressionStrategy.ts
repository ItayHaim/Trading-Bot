import { AppDataSource } from "../data-source"
import { CandleStick } from "../entity/CandleStick"
import { Currency } from "../entity/Currency"
import { IndicatorService } from "../service/indicator.service"
import { StrategyService } from "../service/strategy.service"
import { WaitingLinearRegArrayType } from "../types"

export const linearRegressionStrategy = async () => {
    try {
        const strategyService = new StrategyService()
        const indicatorService = new IndicatorService()
        const waitingOrders: WaitingLinearRegArrayType[] = []

        const currencies = await AppDataSource.manager.find(Currency)
        for (const index in currencies) {
            const currency = currencies[index]

            const candles = await AppDataSource.manager.find(CandleStick, {
                where: { currency: currency }
            })

            const result = indicatorService.checkLinearRegression(candles, currency)
            if (result) {
                waitingOrders.push(result)
            }
        }
        waitingOrders.length > 0 && await strategyService.LinearRegressionStrategy(waitingOrders)

        console.log('End strategy')
    } catch (err) {
        console.error('Linear regression strategy Failed: ' + err)
        throw err
    }
}