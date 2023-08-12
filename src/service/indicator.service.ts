import { Currency } from "../entity/Currency"
import { BuyOrSell } from "../enums"
import { calculateBollingerBands, calculateMACD, calculateRSI, calculateSMA, calculateStochasticRSI } from "../operation/indicators"

export class IndicatorService {
    private checkMACD(closedPrices: number[]) {
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

    private checkRSI(closedPrices: number[]) {
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

    private checkStochasticRSI(closedPrices: number[]) {
        const stochasticRSI = calculateStochasticRSI(closedPrices)
        const lastStochasticRSI = stochasticRSI[stochasticRSI.length - 1]

        if ((lastStochasticRSI.k > lastStochasticRSI.d) && lastStochasticRSI.d < 20) {
            return BuyOrSell.Buy
        } else if ((lastStochasticRSI.k < lastStochasticRSI.d) && lastStochasticRSI.k > 80) {
            return BuyOrSell.Sell
        } else {
            console.log('No signal from Stochastic RSI');
        }
    }

    private checkBolingerBands(closedPrices: number[]) {
        const bollingerBands = calculateBollingerBands(closedPrices)
        const lastBolingerBands = bollingerBands[bollingerBands.length - 1]
        const lastClosedPrice = closedPrices[closedPrices.length - 1]

        // Multiple by this numbers to give a little space for the last closed price 
        if (lastClosedPrice < lastBolingerBands.lower) {
            return BuyOrSell.Buy
        } else if (lastClosedPrice > lastBolingerBands.upper) {
            return BuyOrSell.Sell
        } else {
            console.log('No signal from BolingerBands');
        }
    }

    private checkSMA(closedPrices: number[]) {
        const SMA = calculateSMA(closedPrices)
        console.log('SMA: ', SMA);
    }

    checkAllIndicators(closedPrices: number[], symbol: Currency['symbol']) {
        if (
            this.checkMACD(closedPrices) === BuyOrSell.Buy
            &&
            this.checkRSI(closedPrices) === BuyOrSell.Buy
            &&
            this.checkStochasticRSI(closedPrices) === BuyOrSell.Buy
            &&
            this.checkBolingerBands(closedPrices) === BuyOrSell.Buy
        ) {
            console.log('Should create buy order ' + symbol);
        } else if (
            this.checkMACD(closedPrices) === BuyOrSell.Sell
            &&
            this.checkRSI(closedPrices) === BuyOrSell.Sell
            &&
            this.checkStochasticRSI(closedPrices) === BuyOrSell.Sell
            &&
            this.checkBolingerBands(closedPrices) === BuyOrSell.Sell
        ) {
            console.log('Should create sell order ' + symbol);
        } else {
            console.log('Should NOT create order ' + symbol);
        }
    }
}