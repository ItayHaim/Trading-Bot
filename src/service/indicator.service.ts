import { MACDOutput } from "technicalindicators/declarations/moving_averages/MACD"
import { BuyOrSell, CrossIndicator, Crosses } from "../enums"
import { calculateBollingerBands, calculateCrosses, calculateMACD, calculateRSI, calculateStochasticRSI } from "../operation/indicators"
import { Currency } from "../entity/Currency"
import { WaitingCrossesArrayType } from "../types"

export class IndicatorService {
    public checkMACD(closedPrices: number[]): BuyOrSell {
        const MACD = calculateMACD(closedPrices)
        const lastMACD = MACD[MACD.length - 1]

        if ((lastMACD.MACD > lastMACD.signal) && (lastMACD.histogram > 0)) {
            return BuyOrSell.Buy
        } else if ((lastMACD.MACD < lastMACD.signal) && (lastMACD.histogram < 0)) {
            return BuyOrSell.Sell
        }
        return
    }

    public checkRSI(closedPrices: number[]): BuyOrSell {
        const RSI = calculateRSI(closedPrices)
        const lastRSI = RSI[RSI.length - 1]

        if (lastRSI < 30) {
            return BuyOrSell.Buy
        } else if (lastRSI > 70) {
            return BuyOrSell.Sell
        }
        return
    }

    public checkStochasticRSI(closedPrices: number[]): BuyOrSell {
        const stochasticRSI = calculateStochasticRSI(closedPrices)
        const lastStochasticRSI = stochasticRSI[stochasticRSI.length - 1]

        if ((lastStochasticRSI.k < lastStochasticRSI.d) && lastStochasticRSI.d < 20) {
            return BuyOrSell.Buy
        } else if ((lastStochasticRSI.k > lastStochasticRSI.d) && lastStochasticRSI.k > 80) {
            return BuyOrSell.Sell
        }
        return
    }

    public checkBolingerBands(closedPrices: number[]): BuyOrSell {
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

    public checkCrosses(closedPrices: number[], crossIndicator: CrossIndicator): { order: BuyOrSell, lastResult: MACDOutput } | undefined {
        const crosses = calculateCrosses(closedPrices, crossIndicator)

        // crossUp must be on index 0!!! (according to the type)
        const crossUpValues = crosses[0].values
        // crossDown must be on index 1!!! (according to the type)
        const crossDownValues = crosses[1].values

        const lastCrossUp = crossUpValues[crossUpValues.length - 1]
        const lastCrossDown = crossDownValues[crossDownValues.length - 1]

        if (lastCrossUp === true) {
            return { order: BuyOrSell.Buy, lastResult: crosses[0].lastResult }
        } else if (lastCrossDown === true) {
            return { order: BuyOrSell.Sell, lastResult: crosses[1].lastResult }
        }
        return
    }

    async checkCrossesAndBB(closedPrices: number[], crossIndicator: CrossIndicator, currency: Currency): Promise<void | WaitingCrossesArrayType> {
        const { symbol } = currency

        const cross = this.checkCrosses(closedPrices, crossIndicator)
        const BB = calculateBollingerBands(closedPrices)
        const lastBB = BB[BB.length - 1]
        const lastClosedPrice = closedPrices[closedPrices.length - 1]

        if (cross) {
            if (cross.order === BuyOrSell.Buy) {
                if ((lastClosedPrice <= (lastBB.upper + (lastBB.upper * 0.0011))) && (lastClosedPrice >= lastBB.middle)) {
                    console.log('Should create buy order ' + symbol);
                    const biggerNumber = Math.max(cross.lastResult.MACD, cross.lastResult.signal)
                    const smallerNumber = Math.min(cross.lastResult.MACD, cross.lastResult.signal)

                    return { currency: currency, buyOrSell: BuyOrSell.Buy, MACDDiff: ((biggerNumber - smallerNumber) / smallerNumber) * 100 }
                }
            } else if (cross.order === BuyOrSell.Sell) {
                if ((lastClosedPrice >= (lastBB.lower - (lastBB.lower * 0.0011))) && (lastClosedPrice <= lastBB.middle)) {
                    console.log('Should create sell order ' + symbol);
                    const biggerNumber = Math.max(cross.lastResult.MACD, cross.lastResult.signal)
                    const smallerNumber = Math.min(cross.lastResult.MACD, cross.lastResult.signal)

                    return { currency: currency, buyOrSell: BuyOrSell.Sell, MACDDiff: ((biggerNumber - smallerNumber) / smallerNumber) * 100 }
                }
            } else {
                console.log('Should NOT create order ' + symbol);
            }
        }
    }
}