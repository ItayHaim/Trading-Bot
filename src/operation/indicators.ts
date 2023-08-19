import { BollingerBands, MACD, RSI, SMA, StochasticRSI, CrossDown, CrossUp } from 'technicalindicators';
import { StochasticRSIOutput } from 'technicalindicators/declarations/momentum/StochasticRSI';
import { MACDOutput } from "technicalindicators/declarations/moving_averages/MACD";

import { BollingerBandsOutput } from 'technicalindicators/declarations/volatility/BollingerBands';
import { CrossesOutput, RSIOutput, SMAOutput, SMAPeriods } from "./types";
import { CrossIndicator, Crosses } from '../enums';

/**
 * Calculates the Relative Strength Index (RSI) based on the given OHLCV data and period.
 *
 * @param closedPrices - An array of closedPrices (given by the OHLCV) data.
 * @param period - The period for calculating RSI.
 * @return An array of RSI values.
 */
export const calculateRSI = (closedPrices: number[], period: number = 14): RSIOutput => {
    const res = RSI.calculate({
        values: closedPrices,
        period: period
    });
    return res;
}
// Usage example:
// getCoinOHLCV('BTC/USDT', '5m', undefined, 100)
//     .then(data => calculateRSI(data.map(candle => candle[4])))
//     .then(res => console.log(res))
//     .catch(err => console.error(err));

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
    const res = StochasticRSI.calculate({
        values: closedPrices,
        dPeriod: dPeriod,
        kPeriod: kPeriod,
        rsiPeriod: rsiPeriod,
        stochasticPeriod: stochasticPeriod
    })
    return res
}
// getCoinOHLCV('BTC/USDT', '5m', undefined, 100)
//     .then(data => calculateStochasticRSI(data.map(candle => candle[4])))
//     .then(res => console.log(res))
//     .catch(err => console.error(err));

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
    const res = MACD.calculate({
        values: closedPrices,
        fastPeriod: fastPeriod,
        slowPeriod: slowPeriod,
        signalPeriod: signalPeriod,
        SimpleMAOscillator: useSimpleMAOscillator,
        SimpleMASignal: useSimpleMASignal
    })
    return res
}
// Usage example:
// getCoinOHLCV('BTC/USDT', '5m', undefined, 100)
//     .then(data => calculateMACD(data.map(candle => candle[4])))
//     .then(res => console.log(res))
//     .catch(err => console.error(err));

/**
* Calculates the Simple Moving Average (SMA) for each period
* in the 'periods' array using the closing prices provided in 'closedPrices'.
*
* @param closedPrices - An array of closing prices. If provided array is [110, 105, 102, 100], then 110 is the most recent price.
* @param periods - An array of periods for which the SMA should be calculated. Default periods used are [9, 21, 80, 100, 200].
* 
* @returns Returns an array of objects. Each object contains two properties: 'period' and 'sma'.
*        'period' is the period for which the SMA is calculated.
*        'sma' is the calculated Simple Moving Average for that period.
*/
export const calculateSMA = (closedPrices: number[], periods: SMAPeriods[] = [9, 21, 80, 100, 200]): SMAOutput => {
    return periods.map(period => ({
        period,
        sma: SMA.calculate({
            values: closedPrices,
            period
        })
    }));
}
// Usage example:
// getCoinOHLCV('BTC/USDT', '5m', undefined, 100)
//     .then(data => calculateSMA(data.map(candle => candle[4])))
//     .then(res => console.log(res))
//     .catch(err => console.error(err));

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
    const res = BollingerBands.calculate({
        values: closedPrices,
        period: period,
        stdDev: stdDev
    })
    return res
}
// Usage example:
// getCoinOHLCV('BTC/USDT', '5m', undefined, 100)
//     .then(data => calculateSMA(data.map(candle => candle[4])))
//     .then(res => console.log(res))
//     .catch(err => console.error(err));

export const calculateCrosses = (closedPrices: number[], crossIndicator: CrossIndicator): CrossesOutput => {
    try {
        let lineA: number[], lineB: number[];

        if (crossIndicator === CrossIndicator.SMA) {
            lineA = calculateSMA(closedPrices).find(sma => sma.period === 9).sma
            lineB = calculateSMA(closedPrices).find(sma => sma.period === 100).sma
        } else if (crossIndicator === CrossIndicator.MACD) {
            lineA = calculateMACD(closedPrices).map(macd => macd.signal)
            lineB = calculateMACD(closedPrices).map(macd => macd.MACD)
        }

        const calculateCrossDown = CrossDown.calculate({
            lineA: lineA,
            lineB: lineB,
        })
        const calculateCrossUp = CrossUp.calculate({
            lineA: lineA,
            lineB: lineB,
        })
        console.log('✌️calculateCrossUp --->', calculateCrossUp);
        console.log('✌️calculateCrossDown --->', calculateCrossDown);

        if (calculateCrossUp[calculateCrossUp.length - 1] === true) {
            return Crosses.CrossUp
        }
        else if (calculateCrossDown[calculateCrossDown.length - 1] === true) {
            return Crosses.CrossDown
        } else {
            return 'noCross'
        }
    }
    catch (err) {
        throw new Error('Failed to calculate cross')
    }
}