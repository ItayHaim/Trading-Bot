import { OHLCV, Ticker } from "ccxt"
import { Order, OrderSide, OrderType } from "ccxt/js/src/base/types"
import { binanceExchange } from "./exchange"
import { CreateOrderReturnType } from "../types"

/**
 * Retrieves the balance of a specified coin.
 *
 * @param coin - The coin symbol. Defaults to 'USDT'.
 * @return The free balance of the specified coin.
 */
export const getCoinBalance = async (coin: string = 'USDT'): Promise<string | number> => {
    try {
        const res = await binanceExchange.fetchBalance()
        return res[coin].free
    } catch (err) {
        console.error('Failed to get coin balance: ' + err)
        throw err
    }
}

/**
 * Fetches ticker information from Binance.
 *
 * @param symbol - The ticker symbol to fetch information for.
 * @return A promise that resolves with the ticker information.
 */
export const fetchTicker = async (symbol: string): Promise<Ticker> => {
    try {
        const res = await binanceExchange.fetchTicker(symbol)
        return res
    } catch (err) {
        console.error('Failed to fetch ticker: ' + err)
        throw err
    }
}

/**
 * Retrieves the OHLCV (Open, High, Low, Close, Volume) data for a specific symbol and time frame.
 *
 * @param symbol - The symbol of the cryptocurrency.
 * @param timeFrame - The time frame of the OHLCV data.
 * @param [sinceDate] - The starting date for the OHLCV data. Defaults to the current date.
 * @param [limit] - The maximum number of results to retrieve. Defaults to all results.
 * @param [params] - Additional parameters for the request.
 * @return An array of OHLCV data.
 */
export const getCoinOHLCV = async (symbol: string, timeFrame: string, sinceDate?: Date, limit?: number, params?: Record<any, any>): Promise<Array<OHLCV>> => {
    try {
        const since = binanceExchange.parse8601(sinceDate && new Date(sinceDate).toISOString())
        const res = await binanceExchange.fetchOHLCV(symbol, timeFrame, since, limit, params)
        return res
    } catch (err) {
        console.error('Failed to get coin OHLCV: ' + err)
        throw err
    }
}

/**
 * Calculates the amount of a base currency according to the given quote amount.
 *
 * @param symbol - The symbol of the cryptocurrency.
 * @param quoteAmount - The amount of quote currency you want to purchase.
 * @return The amount of quote currency.
 */
export const getQuoteAmount = async (symbol: string, quoteAmount: number): Promise<number> => {
    try {
        const ticker = await fetchTicker(symbol)
        const price = ticker.close
        return quoteAmount / price
    } catch (err) {
        console.error('Failed to get the quote amount: ' + err)
        throw err
    }
}

/**
 * Creates an order.
 *
 * @param symbol - The symbol of the order (The symbol must be as same as the symbol in the getQuoteAmount function).
 * @param orderType - The type of the order. Defaults to 'market'.
 * @param buyOrSell - The side of the order (buy or sell).
 * @param amountInUSDT - The amount of the order in USDT. Make sure to get the amount with getQuoteAmount function.
 * @param price - At what price you want to create the order. defaults to undefined.
 * @param params - Additional parameters for the order. Defaults to undefined.
 * 
 * @example 
 *  { info: { orderId: '174528195528', symbol: 'BTCUSDT', status: 'FILLED', clientOrderId: 'x-xcKtGhcu4a07d4a00dbd447c923b1a', price: '0.00', avgPrice: '29130.00000', origQty: '0.001', executedQty: '0.001', cumQty: '0.001', cumQuote: '29.13000', timeInForce: 'GTC', type: 'MARKET', reduceOnly: false, closePosition: false, side: 'BUY', positionSide: 'BOTH', stopPrice: '0.00', workingType: 'CONTRACT_PRICE', priceProtect: false, origType: 'MARKET', updateTime: '1690233188146' }, id: '174528195528', clientOrderId: 'x-xcKtGhcu4a07d4a00dbd447c923b1a', timestamp: 1690233188146, datetime: '2023-07-24T21:13:08.146Z', lastTradeTimestamp: 1690233188146, lastUpdateTimestamp: 1690233188146, symbol: 'BTC/USDT:USDT', type: 'market', timeInForce: 'GTC', postOnly: false, reduceOnly: false, side: 'buy', price: 29130, triggerPrice: undefined, amount: 0.001, cost: 29.13, average: 29130, filled: 0.001, remaining: 0, status: 'closed', fee: { currency: undefined, cost: undefined, rate: undefined }, trades: [], fees: [ { currency: undefined, cost: undefined, rate: undefined } ], stopPrice: undefined, takeProfitPrice: undefined, stopLossPrice: undefined }
 * 
 * @return The created order.
 */
export const createOrder = async (symbol: string, buyOrSell: OrderSide, amountInUSDT: number, orderType: OrderType = 'market', price: number = undefined): Promise<CreateOrderReturnType> => {
    try {
        // Get the current price to Determine SL and TP
        const ticker = await fetchTicker(symbol)
        const currentPrice: number = ticker.close
        const stopLossPrice = buyOrSell === 'buy' ? currentPrice * Number(process.env.STOP_LOSS_LONG) : currentPrice * Number(process.env.STOP_LOSS_SHORT)
        const takeProfitPrice = buyOrSell === 'buy' ? currentPrice * Number(process.env.TAKE_PROFIT_LONG) : currentPrice * Number(process.env.TAKE_PROFIT_SHORT)

        const mainOrder = await binanceExchange.createOrder(symbol, orderType, buyOrSell, amountInUSDT, price)

        const SL = await binanceExchange.createOrder(symbol, 'STOP_MARKET', buyOrSell === 'buy' ? 'sell' : 'buy', amountInUSDT, undefined, { 'stopPrice': stopLossPrice })
        const TP = await binanceExchange.createOrder(symbol, 'TAKE_PROFIT_MARKET', buyOrSell === 'buy' ? 'sell' : 'buy', amountInUSDT, undefined, { 'stopPrice': takeProfitPrice })

        return { mainOrderId: mainOrder.id, StopLossId: SL.id, TakeProfitId: TP.id }
    }
    catch (err) {
        console.error('Failed to create the order:' + err)
        throw err
    }
}

/**
 * Cancels an order.
 *
 * @param orderId - The ID of the order to be cancelled.
 * @param symbol - The symbol of the order to be cancelled.
 * @param params - Additional parameters for the cancellation. Defaults to undefined.
 * @return The cancelled order.
 */
export const closeOrder = async (orderId: string, symbol: string, params: Record<any, any> = undefined): Promise<Order> => {
    try {
        const res = await binanceExchange.cancelOrder(orderId, symbol, params)
        return res
    } catch (err) {
        console.error('Failed to close the order: ' + err)
        throw err
    }
}

/**
 * Edits an order.
 *
 * @param orderId - The ID of the order to edit.
 * @param symbol - The symbol of the order.
 * @param buyOrSell - The type of the order.
 * @param amountInUSDT - The amount of the order in USDT. Make sure to get the amount with getQuoteAmount function.
 * @param price - The price of the order. defaults to undefined.
 * @param type - The type of the order. defaults to 'market'.
 * @param params - Additional parameters for the order. defaults to undefined.
 * @return The edited order.
 */
export const editOrder = async (orderId: string, symbol: string, buyOrSell: string, amountInUSDT: number = undefined, price: number = undefined, type: OrderType = 'market', params: Record<any, any> = {}): Promise<Order> => {
    try {
        const res = await binanceExchange.editOrder(orderId, symbol, type, buyOrSell, amountInUSDT, price, params)
        return res
    } catch (err) {
        console.error('Failed to edit the order: ' + err)
        throw err
    }
}

/**
 * Cancels all orders for a given symbol.
 *
 * @param symbol - The symbol of the orders to cancel.
 * @param params - Additional parameters for the cancellation request.
 * @return An array of cancelled orders.
 */
export const closeAllOrdersBySymbol = async (symbol: string, params: Record<any, any> = undefined): Promise<Array<Order>> => {
    try {
        const res = await binanceExchange.cancelAllOrders(symbol, params)
        return res
    } catch (err) {
        console.error('Failed to cancel all orders: ' + err)
        throw err
    }
}

/**
 * Retrieves an order from the Binance exchange.
 *
 * @param orderId - The ID of the order to retrieve.
 * @param symbol - The symbol of the order (optional).
 * @returns The retrieved order.
 */
export const getOrder = async (orderId: string, symbol: string): Promise<Order> => {
    try {
        const res = await binanceExchange.fetchOrder(orderId, symbol)
        return res
    } catch (err) {
        console.error('Failed to get order: ' + err)
        throw err
    }
}

/**
 * Retrieves the open orders for a given symbol, since a specific date, and with an optional limit and additional parameters.
 *
 * @param symbol - The symbol for which to retrieve open orders. Defaults to undefined.
 * @param sinceDate - The date since which to retrieve open orders. Defaults to undefined.
 * @param limit - The maximum number of open orders to retrieve. Defaults to undefined.
 * @param params - Additional parameters for the open orders retrieval. Defaults to undefined.
 * @return A promise that resolves with the open orders.
 */
export const getOpenOrders = async (symbol?: string, sinceDate?: Date, limit?: number, params?: Record<any, any>): Promise<Array<Order>> => {
    try {
        const since = binanceExchange.parse8601(sinceDate && new Date(sinceDate).toISOString())
        const res = await binanceExchange.fetchOpenOrders(symbol, since, limit, params)
        return res
    } catch (err) {
        console.error('Failed to get the open orders: ' + err)
        throw err
    }
}

/**
 * Checks if an order is filled.
 *
 * @param orderId - The ID of the order to check.
 * @param symbol - The symbol of the order to check.
 * @return The order status.
 */
export const isOrderFilled = async (orderId: string, symbol: string): Promise<string> => {
    try {
        const res = await binanceExchange.fetchOrderStatus(orderId, symbol)
        return res
    } catch (err) {
        console.error('Failed to check if order is filled: ' + err)
        throw err
    }
}

/**
 * Changes the leverage for a given symbol on the Binance exchange.
 *
 * @param leverage - The leverage to set.
 * @param symbol - The symbol for which to change the leverage.
 */
export const changeLeverage = async (leverage: number, symbol: string): Promise<any> => {
    try {
        const res = await binanceExchange.setLeverage(leverage, symbol)
        return res
    } catch (err) {
        console.error('Failed to change leverage: ' + err)
        throw err
    }

}

/**
 * Changes the margin mode of a symbol to isolated.
 *
 * @param symbol - The symbol to change the margin mode for.
 * @param marginMode - The margin mode to set. Defaults to 'isolated'.
 */
export const changeToIsolated = async (symbol: string, marginMode: string = 'isolated') => {
    try {
        const res = await binanceExchange.setMarginMode(marginMode, symbol)
        return res
    } catch (err) {
        console.error('Failed to change to isolated: ' + err)
        throw err
    }

}

/**
 * Retrieves the unrealized PNL (Profit and Loss) for a given symbol from the Binance exchange.
 *
 * @param symbol - The symbol of the position to retrieve the PNL for.
 * @return The unrealized PNL for the given symbol.
 */
export const getPositionPNL = async (symbol: string): Promise<number> => {
    try {
        const res = await binanceExchange.fetchPositions([symbol])
        return res[0].unrealizedPnl
    } catch (err) {
        console.error('Failed to get position PNL: ' + err)
        throw err
    }
}