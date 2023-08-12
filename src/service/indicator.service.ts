import { Currency } from "../entity/Currency"
import { BuyOrSell } from "../enums"
import { calculateBollingerBands, calculateMACD, calculateRSI, calculateSMA, calculateStochasticRSI } from "../operation/indicators"

export class IndicatorService {
    private checkMACD(closedPrices: number[]) {
        const MACD = calculateMACD(closedPrices)
        const lastMACD = MACD[MACD.length - 1]
        // console.log(lastMACD);

        if ((lastMACD.MACD > lastMACD.signal) && (lastMACD.histogram > 0)) {
            return BuyOrSell.Buy
        } else if ((lastMACD.MACD < lastMACD.signal) && (lastMACD.histogram < 0)) {
            return BuyOrSell.Sell
        }
        else {
            return
            // console.log('No signal from MACD');
        }
    }

    private checkRSI(closedPrices: number[]) {
        const RSI = calculateRSI(closedPrices)
        const lastRSI = RSI[RSI.length - 1]

        if (lastRSI < 30) {
            return BuyOrSell.Buy
        } else if (lastRSI > 70) {
            return BuyOrSell.Sell
        }
        else {
            return
            // console.log('No signal from RSI');
        }
    }

    private checkStochasticRSI(closedPrices: number[]) {
        const stochasticRSI = calculateStochasticRSI(closedPrices)
        const lastStochasticRSI = stochasticRSI[stochasticRSI.length - 1]

        if ((lastStochasticRSI.k < lastStochasticRSI.d) && lastStochasticRSI.d < 20) {
            return BuyOrSell.Buy
        } else if ((lastStochasticRSI.k > lastStochasticRSI.d) && lastStochasticRSI.k > 80) {
            return BuyOrSell.Sell
        } else {
            return
            // console.log('No signal from Stochastic RSI');
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
            return
            // console.log('No signal from BolingerBands');
        }
    }

    private checkSMA(closedPrices: number[]) {
        const SMA = calculateSMA(closedPrices)
        console.log('SMA: ', SMA);
    }

    checkAllIndicators(closedPrices: number[], currency: Currency) {
        const { symbol } = currency
        // const MACD = this.checkMACD(closedPrices)
        const RSI = this.checkRSI(closedPrices)
        const StochRSI = this.checkStochasticRSI(closedPrices)
        const BB = this.checkBolingerBands(closedPrices)
        console.log('\n');
        // console.log('MACD: ' + MACD);
        console.log('RSI: ' + RSI);
        console.log('StochRSI: ' + StochRSI);
        console.log('BB: ' + BB);

        if (
            // MACD === BuyOrSell.Buy
            // &&
            RSI === BuyOrSell.Buy
            &&
            StochRSI === BuyOrSell.Buy
            &&
            BB === BuyOrSell.Buy
        ) {
            console.log('Should create buy order ' + symbol);
        } else if (
            // MACD === BuyOrSell.Sell
            // &&
            RSI === BuyOrSell.Sell
            &&
            StochRSI === BuyOrSell.Sell
            &&
            BB === BuyOrSell.Sell
        ) {
            console.log('Should create sell order ' + symbol);
        } else {
            console.log('Should NOT create order ' + symbol);
        }
    }
}