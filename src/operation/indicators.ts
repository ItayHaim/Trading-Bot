import { BollingerBands, MACD, RSI, SMA, StochasticRSI, CrossDown, CrossUp, EMA } from 'technicalindicators'
import { StochasticRSIOutput } from 'technicalindicators/declarations/momentum/StochasticRSI'
import { MACDOutput } from "technicalindicators/declarations/moving_averages/MACD"
import { BollingerBandsOutput } from 'technicalindicators/declarations/volatility/BollingerBands'
import { CrossesOutput, RSIOutput, MAOutput, MAPeriods } from "../types"
import { Crosses } from '../enums'

/**
 * Calculates the Relative Strength Index (RSI) based on the given OHLCV data and period.
 *
 * @param closedPrices - An array of closedPrices (given by the OHLCV) data.
 * @param period - The period for calculating RSI.
 * @return An array of RSI values.
 */
export const calculateRSI = (closedPrices: number[], period: number = 14): RSIOutput => {
    try {
        const res = RSI.calculate({
            values: closedPrices,
            period: period
        })
        return res
    } catch (err) {
        console.error('Failed to calculate RSI: ' + err)
        throw err
    }
}

/**
 * This function calculates the Stochastic Relative Strength Index (RSI) based on provided 'closedPrices' and various periods.
 *
 * @param closedPrices - An array of values representing closed prices.
 * @param rsiPeriod - The look back period to calculate RSI. Default is 14.
 * @param stochasticPeriod - The look back period to calculate Stochastic RSI. Default is 14.
 * @param kPeriod - The time period to calculate the %K line for Stochastic RSI. Default is 3.
 * @param dPeriod - The time period to calculate the %D line (3-day moving average of %K) for Stochastic RSI. Default is 3.
 * 
 * @returns Returns an array of StochasticRSIOutput objects (each having k and d values).
 */
export const calculateStochasticRSI = (closedPrices: number[], rsiPeriod: number = 14, stochasticPeriod: number = 14, kPeriod: number = 3, dPeriod: number = 3): StochasticRSIOutput[] => {
    try {
        const res = StochasticRSI.calculate({
            values: closedPrices,
            dPeriod: dPeriod,
            kPeriod: kPeriod,
            rsiPeriod: rsiPeriod,
            stochasticPeriod: stochasticPeriod
        })
        return res
    } catch (err) {
        console.error('Failed to calculate StochasticRSI: ' + err)
        throw err
    }

}

/**
 * Calculates the Moving Average Convergence Divergence (MACD) for a set of closing price data.
 *
 * @param closedPrices - An array of number representing the closing prices.
 * @param fastPeriod - The duration (in term of periods) considered as "fast". Default is 12.
 * @param slowPeriod - The duration (in term of periods) considered as "slow". Default is 26.
 * @param signalPeriod - The duration used to calculate the signal line. Default is 9.
 * @param useSimpleMAOscillator - A boolean to indicate whether or not to use a simple moving average for the oscillator. Default is false.
 * @param useSimpleMASignal - A boolean to indicate whether or not to use a simple moving average for the signal line. Default is false.
 * @returns An array of objects representing the MACD (Moving Average Convergence Divergence) data.
 */
export const calculateMACD = (closedPrices: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9, useSimpleMAOscillator: boolean = false, useSimpleMASignal: boolean = false): MACDOutput[] => {
    try {

        const res = MACD.calculate({
            values: closedPrices,
            fastPeriod: fastPeriod,
            slowPeriod: slowPeriod,
            signalPeriod: signalPeriod,
            SimpleMAOscillator: useSimpleMAOscillator,
            SimpleMASignal: useSimpleMASignal
        })
        return res
    } catch (err) {
        console.error('Failed to calculate MACD: ' + err)
        throw err
    }
}

/**
* Calculates the Simple Moving Average (SMA) for each period
* in the 'periods' array using the closing prices provided in 'closedPrices'.
*
* @param closedPrices - An array of closing prices. If provided array is [3, 21, 100, 200], then 110 is the most recent price.
* @param periods - An array of periods for which the SMA should be calculated. Default periods used are [9, 21, 80, 100, 200].
* 
* @returns Returns an array of objects. Each object contains two properties: 'period' and 'sma'.
*        'period' is the period for which the SMA is calculated.
*        'sma' is the calculated Simple Moving Average for that period.
*/
export const calculateSMA = (closedPrices: number[], periods: MAPeriods[] = [3, 8]): MAOutput => {
    try {
        return periods.map(period => ({
            period,
            ma: SMA.calculate({
                values: closedPrices,
                period
            })
        }))
    } catch (err) {
        console.error('Failed to calculate SMA: ' + err)
        throw err
    }
}

/**
* Calculates the Simple Moving Average (EMA) for each period
* in the 'periods' array using the closing prices provided in 'closedPrices'.
*
* @param closedPrices - An array of closing prices. If provided array is [3, 21, 100, 200], then 110 is the most recent price.
* @param periods - An array of periods for which the EMA should be calculated. Default periods used are [9, 21, 80, 100, 200].
* 
* @returns Returns an array of objects. Each object contains two properties: 'period' and 'ema'.
*        'period' is the period for which the EMA is calculated.
*        'ema' is the calculated Simple Moving Average for that period.
*/
export const calculateEMA = (closedPrices: number[], periods: MAPeriods[] = [3, 8, 13]): MAOutput => {
    try {
        return periods.map(period => ({
            period,
            ma: EMA.calculate({
                values: closedPrices,
                period
            })
        }))
    } catch (err) {
        console.error('Failed to calculate SMA: ' + err)
        throw err
    }
}

/**
* Calculates Bollinger Bands for the given closing prices.
*
* @param closedPrices - An array of closing prices for the financial instrument.
* @param period - The period for which Bollinger Bands should be calculated. This typically represents the number of time intervals.. Default is 20 if not specified.
* @param stdDev - The standard deviation to be used for the calculation of Bollinger Bands. Default is 2 if not specified.
*
* @returns Returns an array of objects. Each object typically includes upper band value, middle band (SMA), and lower band for each time interval based on the provided period and stdDev.
*/
export const calculateBollingerBands = (closedPrices: number[], period: number = 20, stdDev: number = 2): BollingerBandsOutput[] => {
    try {
        const res = BollingerBands.calculate({
            values: closedPrices,
            period: period,
            stdDev: stdDev
        })
        return res
    } catch (err) {
        console.error('Failed to calculate BB: ' + err)
        throw err
    }
}

/**
 * Calculates crosses based on closed prices and cross indicator.
 *
 * @param closedPrices - An array of closed prices.
 * @param crossIndicator - The cross indicator to use (SMA or MACD).
 * @return An array of cross objects.
 */
export const calculateMACDCrosses = (closedPrices: number[]): CrossesOutput => {
    try {
        let lineA: number[], lineB: number[], lastResult: MACDOutput | undefined

        const MACD = calculateMACD(closedPrices)
        lineA = MACD.map(macd => macd.MACD).slice(-30)
        lineB = MACD.map(macd => macd.signal).slice(-30)
        lastResult = MACD[MACD.length - 1]

        const calculateCrossUp = CrossUp.calculate({
            lineA: lineA,
            lineB: lineB,
        })
        const calculateCrossDown = CrossDown.calculate({
            lineA: lineA,
            lineB: lineB,
        })

        return [
            { crossType: Crosses.CrossUp, values: calculateCrossUp, lastResult: lastResult },
            { crossType: Crosses.CrossDown, values: calculateCrossDown, lastResult: lastResult }
        ]
    }
    catch (err) {
        console.error('Failed to calculate cross: ' + err)
        throw err
    }
}

/**
 * Calculates the moving average crosses based on the given array of closed prices.
 *
 * @param closedPrices - An array of closed prices.
 * @return The type of cross that occurred, or undefined if no cross occurred.
 */
export const calculateMACrosses = (closedPrices: number[]): Crosses | undefined => {
    try {
        const SMA = calculateSMA(closedPrices)
        const EMA = calculateEMA(closedPrices)

        const SMAlineA = SMA.find(ma => ma.period === 3).ma.slice(-30)
        const SMAlineB = SMA.find(ma => ma.period === 8).ma.slice(-30)
        const EMAlineA = EMA.find(ma => ma.period === 3).ma.slice(-30)
        const EMAlineB = EMA.find(ma => ma.period === 8).ma.slice(-30)


        const calculateSMACrossUp = CrossUp.calculate({
            lineA: SMAlineA,
            lineB: SMAlineB
        })
        const calculateSMACrossDown = CrossDown.calculate({
            lineA: SMAlineA,
            lineB: SMAlineB
        })
        const calculateEMACrossUp = CrossUp.calculate({
            lineA: EMAlineA,
            lineB: EMAlineB
        })
        const calculateEMACrossDown = CrossDown.calculate({
            lineA: EMAlineA,
            lineB: EMAlineB
        })

        if (calculateSMACrossUp.at(-1) && calculateEMACrossUp.at(-1)) {
            return Crosses.CrossUp
        }

        if (calculateSMACrossDown.at(-1) && calculateEMACrossDown.at(-1)) {
            return Crosses.CrossDown
        }
    }
    catch (err) {
        console.error('Failed to calculate cross: ' + err)
        throw err
    }
}

/**
 * Calculates the linear regression trading indicator values for a given array of closed prices.
 *
 * @param closedPrices - The array of closed prices.
 * @param period - The period for calculating the linear regression values. Default is 50.
 * @param deviation - The standard deviation factor. Default is 2.
 * @return An object containing the upper band, lower band, and average line arrays.
 */
export const calculateLinearRegression = (
    closedPrices: number[],
    period: number = 100,
    deviation: number = 2
): { upperBand: number[], lowerBand: number[], averageLine: number[] } => {
    if (closedPrices.length < period) {
        throw new Error('Insufficient data for the given period.');
    }

    const upperBand: number[] = [];
    const lowerBand: number[] = [];
    const averageLine: number[] = [];

    for (let i = period - 1; i < closedPrices.length; i++) {
        const pricesSlice = closedPrices.slice(i - period + 1, i + 1);
        const sumX = pricesSlice.reduce((acc, _, index) => acc + index, 0);
        const sumY = pricesSlice.reduce((acc, price) => acc + price, 0);
        const sumXY = pricesSlice.reduce((acc, price, index) => acc + index * price, 0);
        const sumXSquare = pricesSlice.reduce((acc, _, index) => acc + index ** 2, 0);

        const n = pricesSlice.length;
        const slope = (n * sumXY - sumX * sumY) / (n * sumXSquare - sumX ** 2);
        const intercept = (sumY - slope * sumX) / n;

        const linearRegressionValues: number[] = [];

        for (let j = i - period + 1; j <= i; j++) {
            const projectedValue = slope * (j - (i - period + 1)) + intercept;
            linearRegressionValues.push(projectedValue);
        }

        const standardDeviation = deviation * Math.sqrt(
            pricesSlice.reduce((acc, price, index) => acc + (price - linearRegressionValues[index]) ** 2, 0) / n
        );

        upperBand.push(linearRegressionValues[linearRegressionValues.length - 1] + standardDeviation);
        lowerBand.push(linearRegressionValues[linearRegressionValues.length - 1] - standardDeviation);
        averageLine.push(linearRegressionValues[linearRegressionValues.length - 1]);
    }

    return { upperBand, lowerBand, averageLine };
};
