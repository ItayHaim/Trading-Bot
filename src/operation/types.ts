//--------------------------OUTPUTS TYPES--------------------------------
export type RSIOutput = number[]

export type SMAOutput = { period: SMAPeriods, sma: number[] }[]

export type CreateOrderReturnType = { mainOrderId: string, StopLossId: string, TakeProfitId: string }

export type SMAPeriods = 9 | 21 | 80 | 100 | 200 

export type CrossesOutput = 'crossUp' | 'crossDown' | 'noCross'