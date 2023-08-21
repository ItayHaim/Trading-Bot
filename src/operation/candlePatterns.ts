import { OHLCV } from "ccxt";
import { bearishengulfingpattern, bearishhammerstick, bearishharami, bullishengulfingpattern, bullishhammerstick, bullishharami, doji, morningstar, shootingstar } from "technicalindicators";
import StockData from "technicalindicators/declarations/StockData";

const convertOHLCVToCandleData = (OHLCV: OHLCV): StockData => {
    try {

        return {
            open: [OHLCV[1]],
            low: [OHLCV[2]],
            high: [OHLCV[3]],
            close: [OHLCV[4]]
        }
    } catch (err) {
        throw new Error('Failed to convert OHCLV to candle data: ' + err)
    }
}

//----------------------------REVERSAL PATTERNS----------------------------------
export const isDoji = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = doji(value)
        return res
    } catch (err) {
        throw new Error('Failed to check candle type: ' + err)
    }
}

//----------------------------BULLISH PATTERNS----------------------------------
export const isBullishEngulfingPattern = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = bullishengulfingpattern(value)
        return res
    } catch (err) {
        throw new Error('Failed to check candle type: ' + err)
    }
}

export const isBullishHarami = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = bullishharami(value)
        return res
    } catch (err) {
        throw new Error('Failed to check candle type: ' + err)
    }
}

export const isBullishHammer = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = bullishhammerstick(value)
        return res
    } catch (err) {
        throw new Error('Failed to check candle type: ' + err)
    }
}

export const isMorningStar = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = morningstar(value)
        return res
    } catch (err) {
        throw new Error('Failed to check candle type: ' + err)
    }
}

//----------------------------BEARISH PATTERNS----------------------------------
export const isBearishEngulfingPattern = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = bearishengulfingpattern(value)
        return res
    } catch (err) {
        throw new Error('Failed to check candle type: ' + err)
    }
}

export const isBearishHarami = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = bearishharami(value)
        return res
    } catch (err) {
        throw new Error('Failed to check candle type: ' + err)
    }
}

export const isBearishHammer = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = bearishhammerstick(value)
        return res
    } catch (err) {
        throw new Error('Failed to check candle type: ' + err)
    }
}

export const isShootingStar = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = shootingstar(value)
        return res
    } catch (err) {
        throw new Error('Failed to check candle type: ' + err)
    }
}