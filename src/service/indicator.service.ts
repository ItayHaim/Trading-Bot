import { MACDOutput } from "technicalindicators/declarations/moving_averages/MACD"
import { BuyOrSell } from "../enums"
import { calculateBollingerBands, calculateMACD, calculateMACDCrosses, calculateRSI, calculateSMA, calculateStochasticRSI } from "../operation/indicators"
import { Currency } from "../entity/Currency"
import { WaitingCrossesArrayType } from "../types"

export class IndicatorService {
    public checkMACD(closedPrices: number[]): BuyOrSell {
        try {
            const MACD = calculateMACD(closedPrices)
            const lastMACD = MACD[MACD.length - 1]

            if ((lastMACD.MACD > lastMACD.signal) && (lastMACD.histogram > 0)) {
                return BuyOrSell.Buy
            } else if ((lastMACD.MACD < lastMACD.signal) && (lastMACD.histogram < 0)) {
                return BuyOrSell.Sell
            }
            return
        } catch (err) {
            console.error('Failed to check MACD: ' + err)
            throw err
        }
    }

    public checkRSI(closedPrices: number[]): BuyOrSell {
        try {
            const RSI = calculateRSI(closedPrices)
            const lastRSI = RSI[RSI.length - 1]

            if (lastRSI < 30) {
                return BuyOrSell.Buy
            } else if (lastRSI > 70) {
                return BuyOrSell.Sell
            }
            return
        } catch (err) {
            console.error('Failed to check RSI: ' + err)
            throw err
        }
    }

    public checkStochasticRSI(closedPrices: number[]): BuyOrSell {
        try {
            const stochasticRSI = calculateStochasticRSI(closedPrices)
            const lastStochasticRSI = stochasticRSI[stochasticRSI.length - 1]

            if ((lastStochasticRSI.k < lastStochasticRSI.d) && lastStochasticRSI.d < 20) {
                return BuyOrSell.Buy
            } else if ((lastStochasticRSI.k > lastStochasticRSI.d) && lastStochasticRSI.k > 80) {
                return BuyOrSell.Sell
            }
            return
        } catch (err) {
            console.error('Failed to check StochasticRSI: ' + err)
            throw err
        }
    }

    public checkBolingerBands(closedPrices: number[]): BuyOrSell {
        try {
            const bollingerBands = calculateBollingerBands(closedPrices)
            const lastBolingerBands = bollingerBands[bollingerBands.length - 1]
            const lastClosedPrice = closedPrices[closedPrices.length - 1]

            if (lastClosedPrice < lastBolingerBands.lower) {
                return BuyOrSell.Buy
            } else if (lastClosedPrice > lastBolingerBands.upper) {
                return BuyOrSell.Sell
            }
            return
        } catch (err) {
            console.error('Failed to check BB: ' + err)
            throw err
        }
    }

    public checkCrosses(closedPrices: number[]): { order?: BuyOrSell, lastResult?: MACDOutput } | undefined {
        try {
            const crosses = calculateMACDCrosses(closedPrices)

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
        } catch (err) {
            console.error('Failed to check crosses: ' + err)
            throw err
        }
    }

    async checkMACDCrossesAndBB(closedPrices: number[], currency: Currency): Promise<void | WaitingCrossesArrayType> {
        try {
            const { symbol } = currency

            const cross = this.checkCrosses(closedPrices)
            const BB = calculateBollingerBands(closedPrices)
            const lastBB = BB[BB.length - 1]
            const lastClosedPrice = closedPrices[closedPrices.length - 1]

            if (cross) {
                const biggerNumber = Math.max(cross.lastResult.MACD, cross.lastResult.signal)
                const smallerNumber = Math.min(cross.lastResult.MACD, cross.lastResult.signal)
                const calculateMACDDiff = Math.abs(((biggerNumber - smallerNumber) / smallerNumber) * 100)

                if (cross.order === BuyOrSell.Buy && calculateMACDDiff >= 8) {
                    if ((lastClosedPrice <= lastBB.upper) && (lastClosedPrice >= lastBB.middle)) {
                        console.log('Should create buy order ' + symbol);
                        return { currency: currency, buyOrSell: BuyOrSell.Buy, MACDDiff: calculateMACDDiff }
                    }
                } else if (cross.order === BuyOrSell.Sell && calculateMACDDiff >= 8) {
                    if ((lastClosedPrice >= lastBB.lower) && (lastClosedPrice <= lastBB.middle)) {
                        console.log('Should create sell order ' + symbol);
                        return { currency: currency, buyOrSell: BuyOrSell.Sell, MACDDiff: calculateMACDDiff }
                    }
                } else {
                    console.log('Should NOT create order ' + symbol);
                }
            }
        } catch (err) {
            console.error('Failed to check cross and BB: ' + err)
            throw err
        }
    }

    async checkSMACrosses(closedPrices: number[], currency: Currency) {
        const { symbol } = currency

    }
}