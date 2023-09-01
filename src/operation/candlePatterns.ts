import { OHLCV } from "ccxt";
import { bearishengulfingpattern, bearishhammerstick, bearishharami, bullishengulfingpattern, bullishhammerstick, bullishharami, doji, morningstar, shootingstar } from "technicalindicators";
import StockData from "technicalindicators/declarations/StockData";
import { CandleStick } from "../entity/CandleStick";

const convertOHLCVToCandleData = (OHLCV: OHLCV): StockData => {
    try {
        return {
            open: [OHLCV[1]],
            low: [OHLCV[2]],
            high: [OHLCV[3]],
            close: [OHLCV[4]]
        }
    } catch (err) {
        console.error('Failed to convert OHCLV to candle data: ' + err)
        throw err
    }
}

//----------------------------REVERSAL PATTERNS----------------------------------
export const checkDoji = (CandleStick: CandleStick): boolean => {
    try {
        const value: StockData = {
            open: [Number(CandleStick.open)],
            low: [Number(CandleStick.low)],
            high: [Number(CandleStick.high)],
            close: [Number(CandleStick.closed)]
        }
        const res = doji(value)
        return res
    } catch (err) {
        console.error('Failed to check candle type: ' + err)
        throw err
    }
}

//----------------------------BULLISH PATTERNS----------------------------------
export const checkBullishEngulfingPattern = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = bullishengulfingpattern(value)
        return res
    } catch (err) {
        console.error('Failed to check candle type: ' + err)
        throw err
    }
}

export const checkBullishHarami = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = bullishharami(value)
        return res
    } catch (err) {
        console.error('Failed to check candle type: ' + err)
        throw err
    }
}

export const checkBullishHammer = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = bullishhammerstick(value)
        return res
    } catch (err) {
        console.error('Failed to check candle type: ' + err)
        throw err
    }
}

export const checkMorningStar = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = morningstar(value)
        return res
    } catch (err) {
        console.error('Failed to check candle type: ' + err)
        throw err
    }
}

//----------------------------BEARISH PATTERNS----------------------------------
export const checkBearishEngulfingPattern = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = bearishengulfingpattern(value)
        return res
    } catch (err) {
        console.error('Failed to check candle type: ' + err)
        throw err
    }
}

export const checkBearishHarami = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = bearishharami(value)
        return res
    } catch (err) {
        console.error('Failed to check candle type: ' + err)
        throw err
    }
}

export const checkBearishHammer = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = bearishhammerstick(value)
        return res
    } catch (err) {
        console.error('Failed to check candle type: ' + err)
        throw err
    }
}

export const checkShootingStar = (OHLCV: OHLCV): boolean => {
    try {
        const value = convertOHLCVToCandleData(OHLCV)
        const res = shootingstar(value)
        return res
    } catch (err) {
        console.error('Failed to check candle type: ' + err)
        throw err
    }
}