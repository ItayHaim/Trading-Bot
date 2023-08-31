import { AppDataSource } from "../data-source"
import { CandleStick } from "../entity/CandleStick"
import { Currency } from "../entity/Currency"
import { IndicatorService } from "../service/indicator.service"
import { StrategyService } from "../service/strategy.service"

export const SMACrossStrategy = async () => {
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
            console.log('✌️candles --->', candles);
            
            const closedPrices = candles.map(candle => Number(candle.closed))

            await indicatorService.checkSMACrosses(closedPrices, currency)
        }

        console.log('End strategy')
    } catch (err) {
        console.error('Cross strategy Failed: ' + err)
        throw err
    }
}