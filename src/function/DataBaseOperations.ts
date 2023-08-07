import { In } from "typeorm"
import { CurrenciesArray } from "../consts"
import { AppDataSource } from "../data-source"
import { CandleStick } from "../entity/CandleStick"
import { Currency } from "../entity/Currency"
import { Order } from "../entity/Order"
import { OrderStatus, OrderType } from "../enums"
import { closeOrder, getCoinOHLCV, isOrderFilled } from "../operation/exchangeOperations"

/**
 * Adds one candle to the database for each currency in the CurrenciesArray.
 */
export const addOneCandle = async (): Promise<void> => {
    const timeFrame = process.env.TIME_FRAME

    for (const coinPair in CurrenciesArray) {
        const symbol = CurrenciesArray[coinPair]

        const currency = await AppDataSource.manager.findOneOrFail(Currency, {
            where: { symbol: symbol }
        })

        const oneOHLCV = (await getCoinOHLCV(symbol, timeFrame, undefined, 1))[0]

        await AppDataSource.manager.save(CandleStick, {
            symbol: currency,
            date: new Date(oneOHLCV[0]),
            open: oneOHLCV[1],
            high: oneOHLCV[2],
            low: oneOHLCV[3],
            closed: oneOHLCV[4],
            volume: oneOHLCV[5]
        })
    }
    console.log('Added on candle!');
}

export const checkOrders = async () => {
    const orders = await AppDataSource.manager.find(Order, {
        where: { orderType: In([OrderType.StopLoss, OrderType.TakeProfit]) },
        relations: { currency: true }
    })

    for (const order of orders) {
        const { id, orderId, currency } = order
        const { symbol } = currency

        const status = await isOrderFilled(orderId, symbol)
        if (status === OrderStatus.Closed) {
            await closeOrder(orderId, symbol)
            await AppDataSource
                .createQueryBuilder()
                .delete()
                .from(Order)
                .where('id = :id', { id: id })
                .execute();
            console.log(`order: ${orderId} (${symbol}) is closed!`);
        }
    }
}