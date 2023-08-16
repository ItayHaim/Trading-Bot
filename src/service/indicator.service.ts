import { Currency } from "../entity/Currency"
import { BuyOrSell } from "../enums"
import { calculateBollingerBands, calculateMACD, calculateRSI, calculateSMA, calculateStochasticRSI } from "../operation/indicators"
import { OrderService } from "./order.service"

export class IndicatorService {
    private orderService = new OrderService()

    private checkMACD(closedPrices: number[]): BuyOrSell {
        const MACD = calculateMACD(closedPrices)
        const lastMACD = MACD[MACD.length - 1]

        if ((lastMACD.MACD > lastMACD.signal) && (lastMACD.histogram > 0)) {
            return BuyOrSell.Buy
        } else if ((lastMACD.MACD < lastMACD.signal) && (lastMACD.histogram < 0)) {
            return BuyOrSell.Sell
        }
        return
    }

    private checkRSI(closedPrices: number[]): BuyOrSell {
        const RSI = calculateRSI(closedPrices)
        const lastRSI = RSI[RSI.length - 1]

        if (lastRSI < 30) {
            return BuyOrSell.Buy
        } else if (lastRSI > 70) {
            return BuyOrSell.Sell
        }
        return
    }

    private checkStochasticRSI(closedPrices: number[]): BuyOrSell {
        const stochasticRSI = calculateStochasticRSI(closedPrices)
        const lastStochasticRSI = stochasticRSI[stochasticRSI.length - 1]

        if ((lastStochasticRSI.k < lastStochasticRSI.d) && lastStochasticRSI.d < 20) {
            return BuyOrSell.Buy
        } else if ((lastStochasticRSI.k > lastStochasticRSI.d) && lastStochasticRSI.k > 80) {
            return BuyOrSell.Sell
        }
        return
    }

    private checkBolingerBands(closedPrices: number[]): BuyOrSell {
        const bollingerBands = calculateBollingerBands(closedPrices)
        const lastBolingerBands = bollingerBands[bollingerBands.length - 1]
        const lastClosedPrice = closedPrices[closedPrices.length - 1]

        if (lastClosedPrice < lastBolingerBands.lower) {
            return BuyOrSell.Buy
        } else if (lastClosedPrice > lastBolingerBands.upper) {
            return BuyOrSell.Sell
        }
        return
    }

    private checkSMA(closedPrices: number[]) {
        const SMA = calculateSMA(closedPrices)
        console.log('SMA: ', SMA);
    }

    async checkAllIndicators(closedPrices: number[], currency: Currency) {
        const { symbol } = currency

        // const MACD = this.checkMACD(closedPrices)
        const RSI = this.checkRSI(closedPrices)
        const StochRSI = this.checkStochasticRSI(closedPrices)
        const BB = this.checkBolingerBands(closedPrices)
        if (
            RSI === BuyOrSell.Buy
            &&
            StochRSI === BuyOrSell.Buy
            &&
            BB === BuyOrSell.Buy
        ) {
            await this.orderService.createFullOrder(currency, BuyOrSell.Buy)
            console.log('Should create buy order ' + symbol);
        } else if (
            RSI === BuyOrSell.Sell
            &&
            StochRSI === BuyOrSell.Sell
            &&
            BB === BuyOrSell.Sell
        ) {
            await this.orderService.createFullOrder(currency, BuyOrSell.Sell)
            console.log('Should create sell order ' + symbol);
        } else {
            console.log('Should NOT create order ' + symbol);
        }
    }
}