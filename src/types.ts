import { MACDOutput } from "technicalindicators/declarations/moving_averages/MACD"
import { BuyOrSell, Crosses } from "./enums"
import { Currency } from "./entity/Currency"

//--------------------------OUTPUTS TYPES--------------------------------
export type RSIOutput = number[]

export type MAOutput = { period: MAPeriods, ma: number[] }[]

export type CreateOrderReturnType = { mainOrderId: string, StopLossId: string, TakeProfitId: string }

export type CrossesOutput = [{ crossType: Crosses.CrossUp, values: boolean[], lastResult: MACDOutput | undefined }, { crossType: Crosses.CrossDown, values: boolean[], lastResult: MACDOutput | undefined }]

//--------------------------INDICATORS TYPES--------------------------------
export type MAPeriods = 3 | 8 | 9 | 13 | 21 | 80 | 100 | 200


//--------------------------STRATEGY TYPES--------------------------------
export type WaitingArrayType = { currency: Currency, buyOrSell: BuyOrSell }
export type WaitingMACDCrossArrayType = WaitingArrayType & { MACDDiff: number }
export type WaitingMACrossArrayType = WaitingArrayType & { RSIValue: number }
export type WaitingLinearRegArrayType = WaitingArrayType & { PricePercentageDiff: number }


