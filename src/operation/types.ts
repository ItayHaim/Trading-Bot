import { Crosses } from "../enums"

//--------------------------OUTPUTS TYPES--------------------------------
export type RSIOutput = number[]

export type SMAOutput = { period: SMAPeriods, sma: number[] }[]

export type CreateOrderReturnType = { mainOrderId: string, StopLossId: string, TakeProfitId: string }

export type CrossesOutput = [{ crossType: Crosses.CrossUp, values: boolean[] }, { crossType: Crosses.CrossDown, values: boolean[] }]

//--------------------------INDICATORS TYPES--------------------------------
export type SMAPeriods = 9 | 21 | 80 | 100 | 200
