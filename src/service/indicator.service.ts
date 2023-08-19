import { BuyOrSell, CrossIndicator, Crosses } from "../enums"
import { calculateBollingerBands, calculateCrosses, calculateMACD, calculateRSI, calculateStochasticRSI } from "../operation/indicators"

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

    public checkCrosses(closedPrices: number[], crossIndicator: CrossIndicator): BuyOrSell {
        const crosses = calculateCrosses(closedPrices, crossIndicator)
        const lastCross = crosses[crosses.length - 1]

        if (lastCross === Crosses.CrossUp) {
            return BuyOrSell.Buy
        } else if (lastCross === Crosses.CrossDown) {
            return BuyOrSell.Sell
        }
        return
    }
}