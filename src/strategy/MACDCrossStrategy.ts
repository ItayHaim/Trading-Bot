import { AppDataSource } from "../data-source";
import { CandleStick } from "../entity/CandleStick";
import { Currency } from "../entity/Currency";
import { IndicatorService } from "../service/indicator.service";
import { StrategyService } from "../service/strategy.service";
import { WaitingMACDCrossArrayType } from "../types";

export const MACDCrossStrategy = async () => {
    try {
        const strategyService = new StrategyService()
        const indicatorService = new IndicatorService()
        const waitingOrders: WaitingMACDCrossArrayType[] = []

        // Get all currencies and run the indicator on each currency
        const currencies = await AppDataSource.manager.find(Currency)
        for (const index in currencies) {
            const currency = currencies[index]

            const candles = await AppDataSource.manager.find(CandleStick, {
                where: { currency: currency }
            })
            const closedPrices = candles.map(candle => Number(candle.closed));

            const result = await indicatorService.checkMACDCrossesAndBB(closedPrices, currency)
            if (result) {
                waitingOrders.push(result)
            }
        }
        await strategyService.MACDCrossesAndBBStrategy(waitingOrders)

        console.log('End strategy');
    } catch (err) {
        console.error('Cross strategy Failed: ' + err)
        throw err
    }
}