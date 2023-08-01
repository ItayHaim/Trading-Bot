import { OHLCV } from "ccxt";
import { bearishengulfingpattern, bearishhammerstick, bearishharami, bullishengulfingpattern, bullishhammerstick, bullishharami, doji, morningstar, shootingstar } from "technicalindicators";
import StockData from "technicalindicators/declarations/StockData";

const convertOHLCVToCandleData = (OHLCV: OHLCV): StockData => {
    return {
        open: [OHLCV[1]],
        low: [OHLCV[2]],
        high: [OHLCV[3]],
        close: [OHLCV[4]]
    }
}

//----------------------------REVERSAL PATTERNS----------------------------------
export const isDoji = (OHLCV: OHLCV): boolean => {
    const value = convertOHLCVToCandleData(OHLCV)
    const res = doji(value)
    return res
}

//----------------------------BULLISH PATTERNS----------------------------------
export const isBullishEngulfingPattern = (OHLCV: OHLCV): boolean => {
    const value = convertOHLCVToCandleData(OHLCV)
    const res = bullishengulfingpattern(value)
    return res
}

export const isBullishHarami = (OHLCV: OHLCV): boolean => {
    const value = convertOHLCVToCandleData(OHLCV)
    const res = bullishharami(value)
    return res
}

export const isBullishHammer = (OHLCV: OHLCV): boolean => {
    const value = convertOHLCVToCandleData(OHLCV)
    const res = bullishhammerstick(value)
    return res
}

export const isMorningStar = (OHLCV: OHLCV): boolean => {
    const value = convertOHLCVToCandleData(OHLCV)
    const res = morningstar(value)
    return res
}

//----------------------------BEARISH PATTERNS----------------------------------
export const isBearishEngulfingPattern = (OHLCV: OHLCV): boolean => {
    const value = convertOHLCVToCandleData(OHLCV)
    const res = bearishengulfingpattern(value)
    return res
}

export const isBearishHarami = (OHLCV: OHLCV): boolean => {
    const value = convertOHLCVToCandleData(OHLCV)
    const res = bearishharami(value)
    return res
}

export const isBearishHammer = (OHLCV: OHLCV): boolean => {
    const value = convertOHLCVToCandleData(OHLCV)
    const res = bearishhammerstick(value)
    return res
}

export const isShootingStar = (OHLCV: OHLCV): boolean => {
    const value = convertOHLCVToCandleData(OHLCV)
    const res = shootingstar(value)
    return res
}