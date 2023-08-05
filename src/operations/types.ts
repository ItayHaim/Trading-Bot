//--------------------------OUTPUTS TYPES--------------------------------
export type RSIOutput = number[]

export type SMAOutput = { period: number, sma: number[] }[]

export type CreateOrderReturnType = { mainOrderId: string, StopLossId: string, TakeProfitId: string }