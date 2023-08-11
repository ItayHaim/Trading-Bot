import { BuyOrSell } from "../enums"
import { calculateMACD, calculateRSI, calculateStochasticRSI } from "../operation/indicators"

export class IndicatorsService {
    async checkMACD(closedPrices: number[]) {
        const MACD = calculateMACD(closedPrices)
        const lastMACD = MACD[MACD.length - 1]
        if ((lastMACD.MACD > lastMACD.signal) && (lastMACD.histogram > 0)) {
            return BuyOrSell.Buy
        } else if ((lastMACD.MACD < lastMACD.signal) && (lastMACD.histogram < 0)) {
            return BuyOrSell.Sell
        }
        else {
            console.log('No signal from MACD');
        }
    }

    async checkRSI(closedPrices: number[]) {
        const RSI = calculateRSI(closedPrices)
        const lastRSI = RSI[RSI.length - 1]
        if (lastRSI > 70) {
            return BuyOrSell.Buy
        } else if (lastRSI < 30) {
            return BuyOrSell.Sell
        }
        else {
            console.log('No signal from RSI');
        }
    }

    async checkStochasticRSI(closedPrices: number[]) {
        const stochasticRSI = calculateStochasticRSI(closedPrices)
        const lastStochasticRSI = stochasticRSI[stochasticRSI.length - 1]
        if (lastStochasticRSI.k > lastStochasticRSI.d) {
            return BuyOrSell.Buy
        } else if (lastStochasticRSI.k < lastStochasticRSI.d) {
            return BuyOrSell.Sell
        } else {
            console.log('No signal from Stochastic RSI');
        }
    }
}