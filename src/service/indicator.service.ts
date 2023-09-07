import { MACDOutput } from "technicalindicators/declarations/moving_averages/MACD"
import { BuyOrSell, Crosses } from "../enums"
import { calculateBollingerBands, calculateLinearRegression, calculateMACD, calculateMACDCrosses, calculateMACrosses, calculateRSI, calculateSMA, calculateStochasticRSI } from "../operation/indicators"
import { Currency } from "../entity/Currency"
import { WaitingLinearRegArrayType, WaitingMACDCrossArrayType, WaitingMACrossArrayType } from "../types"
import { CandleStick } from "../entity/CandleStick"
import { checkDoji } from "../operation/candlePatterns"

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

    public checkMACDCrosses(closedPrices: number[]): { order?: BuyOrSell, lastResult?: MACDOutput } | undefined {
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

    async checkMACDCrossesAndBB(closedPrices: number[], currency: Currency): Promise<void | WaitingMACDCrossArrayType> {
        try {
            const { symbol } = currency

            const cross = this.checkMACDCrosses(closedPrices)
            const BB = calculateBollingerBands(closedPrices)
            const lastBB = BB[BB.length - 1]
            const lastClosedPrice = closedPrices[closedPrices.length - 1]

            if (cross) {
                const biggerNumber = Math.max(cross.lastResult.MACD, cross.lastResult.signal)
                const smallerNumber = Math.min(cross.lastResult.MACD, cross.lastResult.signal)
                const calculateMACDDiff = Math.abs(((biggerNumber - smallerNumber) / smallerNumber) * 100)

                if (cross.order === BuyOrSell.Buy && calculateMACDDiff >= 8) {
                    if ((lastClosedPrice <= lastBB.upper) && (lastClosedPrice >= lastBB.middle)) {
                        console.log('Should create buy order ' + symbol)
                        return { currency: currency, buyOrSell: BuyOrSell.Buy, MACDDiff: calculateMACDDiff }
                    }
                } else if (cross.order === BuyOrSell.Sell && calculateMACDDiff >= 8) {
                    if ((lastClosedPrice >= lastBB.lower) && (lastClosedPrice <= lastBB.middle)) {
                        console.log('Should create sell order ' + symbol)
                        return { currency: currency, buyOrSell: BuyOrSell.Sell, MACDDiff: calculateMACDDiff }
                    }
                } else {
                    console.log('Should NOT create order ' + symbol)
                }
            }
        } catch (err) {
            console.error('Failed to check cross and BB: ' + err)
            throw err
        }
    }

    checkMACrosses(closedPrices: number[], lastCandleStick: CandleStick, currency: Currency): void | WaitingMACrossArrayType {
        try {
            const { symbol } = currency
            const cross = calculateMACrosses(closedPrices)
            const isDoji = checkDoji(lastCandleStick)
            const RSI = calculateRSI(closedPrices)
            const RSIValue = RSI.at(-1)

            if (cross && !isDoji) {
                if ((cross === Crosses.CrossUp) && (RSIValue > 54)) {
                    console.log('Should create buy order ' + symbol)
                    return { currency: currency, buyOrSell: BuyOrSell.Buy, RSIValue: RSIValue }
                } else if ((cross === Crosses.CrossDown) && (RSIValue < 46)) {
                    console.log('Should create sell order ' + symbol)
                    return { currency: currency, buyOrSell: BuyOrSell.Sell, RSIValue: RSIValue }
                }
                else {
                    console.log('Should NOT create order ' + symbol)
                }
            }
        } catch (err) {
            console.error('Failed to check MA crosses: ' + err)
            throw err
        }
    }

    checkLinearRegression(candles: CandleStick[], currency: Currency): void | WaitingLinearRegArrayType {
        try {
            const { symbol } = currency
            const closedPrices = candles.map(candle => Number(candle.closed))
            const lastLowPrice = candles.at(-1).low
            const lastHighPrice = candles.at(-1).high
            const oneBeforeLastHighPrice = candles.at(-2).high
            const oneBeforeLastLowPrice = candles.at(-2).low

            const linearRegression = calculateLinearRegression(closedPrices)
            const lastLinearRegression = {
                upperBand: linearRegression.upperBand.at(-1),
                lowerBand: linearRegression.lowerBand.at(-1),
                averageLine: linearRegression.averageLine.at(-1)
            }

            // const oneBeforeLastLinearRegression = {
            //     upperBand: linearRegression.upperBand.at(-2),
            //     lowerBand: linearRegression.lowerBand.at(-2),
            //     averageLine: linearRegression.averageLine.at(-2)
            // }

            // console.log('✌️oneBeforeLastLowPrice --->', oneBeforeLastLowPrice)
            // console.log('✌️oneBeforeLastHighPrice --->', oneBeforeLastHighPrice)
            // console.log('✌️oneBeforeLastClosedPrice --->', oneBeforeLastClosedPrice)
            // console.log('✌️oneBeforeLastLinearRegression --->', oneBeforeLastLinearRegression)
            // if (lastLowPrice <= lastLinearRegression.lowerBand) {
            //     console.log('Should create buy order ' + symbol)
            //     return { currency: currency, buyOrSell: BuyOrSell.Buy, PricePercentageDiff: Math.abs(((lastLinearRegression.lowerBand - lastLowPrice) / lastLowPrice) * 100) }
            // } else if (lastHighPrice >= lastLinearRegression.upperBand) {
            //     console.log('Should create sell order ' + symbol)
            //     return { currency: currency, buyOrSell: BuyOrSell.Sell, PricePercentageDiff: Math.abs(((lastHighPrice - lastLinearRegression.upperBand) / lastLinearRegression.upperBand) * 100) }
            // }
            if (oneBeforeLastLowPrice <= lastLinearRegression.lowerBand) {
                const MACD = calculateMACD(closedPrices)
                const lastMACDHistogram = MACD.at(-1).histogram
                const oneBeforeLastMACDHistogram = MACD.at(-2).histogram

                if (lastMACDHistogram > oneBeforeLastMACDHistogram) {
                    console.log(candles.at(-1))
                    console.log('Should create buy order ' + symbol)
                    console.log('✌️lastLinearRegression.lowerBand --->', lastLinearRegression.lowerBand)
                    console.log('✌️oneBeforeLastLowPrice --->', oneBeforeLastLowPrice)
                    console.log('✌️lastMACDHistogram --->', lastMACDHistogram)
                    console.log('✌️oneBeforeLastMACDHistogram --->', oneBeforeLastMACDHistogram + '\n')
                    return { currency: currency, buyOrSell: BuyOrSell.Buy, PricePercentageDiff: Math.abs(((lastLinearRegression.lowerBand - lastLowPrice) / lastLowPrice) * 100) }
                }
            } else if (oneBeforeLastHighPrice >= lastLinearRegression.upperBand) {
                const MACD = calculateMACD(closedPrices)
                const lastMACDHistogram = MACD.at(-1).histogram
                const oneBeforeLastMACDHistogram = MACD.at(-2).histogram

                if (lastMACDHistogram < oneBeforeLastMACDHistogram) {
                    console.log(candles.at(-1))
                    console.log('Should create sell order ' + symbol)
                    console.log('✌️lastLinearRegression.upperBand --->', lastLinearRegression.upperBand)
                    console.log('✌️oneBeforeLastHighPrice --->', oneBeforeLastHighPrice)
                    console.log('✌️lastMACDHistogram --->', lastMACDHistogram)
                    console.log('✌️oneBeforeLastMACDHistogram --->', oneBeforeLastMACDHistogram + '\n')
                    return { currency: currency, buyOrSell: BuyOrSell.Sell, PricePercentageDiff: Math.abs(((lastHighPrice - lastLinearRegression.upperBand) / lastLinearRegression.upperBand) * 100) }
                }
            }
            return
        } catch (err) {
            console.error('Failed to check linear regression: ' + err)
            throw err
        }
    }
}