import { MACDOutput } from "technicalindicators/declarations/moving_averages/MACD"
import { BuyOrSell, Crosses } from "./enums"
import { Currency } from "./entity/Currency"

//--------------------------OUTPUTS TYPES--------------------------------
export type RSIOutput = number[]

export type SMAOutput = { period: SMAPeriods, sma: number[] }[]

export type CreateOrderReturnType = { mainOrderId: string, StopLossId: string, TakeProfitId: string }

export type CrossesOutput = [{ crossType: Crosses.CrossUp, values: boolean[], lastResult: MACDOutput | undefined }, { crossType: Crosses.CrossDown, values: boolean[], lastResult: MACDOutput | undefined }]

//--------------------------INDICATORS TYPES--------------------------------
export type SMAPeriods = 9 | 21 | 80 | 100 | 200


//--------------------------STRATEGY TYPES--------------------------------
export type WaitingCrossesArrayType = { currency: Currency, buyOrSell: BuyOrSell, MACDDiff: number }


