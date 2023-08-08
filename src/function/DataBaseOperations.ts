import { CurrenciesArray } from "../consts"
import { AppDataSource } from "../data-source"
import { CandleStick } from "../entity/CandleStick"
import { Currency } from "../entity/Currency"
import { MainOrder } from "../entity/MainOrder"
import { SideOrder } from "../entity/SideOrder"
import { OrderStatus } from "../enums"
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
    const orders = await AppDataSource.manager.find(SideOrder, {
        where: { status: OrderStatus.Open },
        relations: { mainOrder: { currency: true } }
    })

    for (const order of orders) {
        const { mainOrder } = order
        const { symbol } = mainOrder.currency

        const status = await isOrderFilled(order.orderId, symbol)

        setTimeout(async () => {
            await closeOrder(order.orderId, symbol)
        }, 1000 * 10)
        if (status === OrderStatus.Closed) {
            await closeOrder(mainOrder.orderId, symbol)
            // await closeOrder(order.orderId, symbol)

            // Find the other SideOrder (TP/SL) to close him
            const otherSideOrders = await AppDataSource.getRepository(SideOrder)
                .createQueryBuilder("sideOrder")
                .where("sideOrder.mainOrder = :mainOrderId", { mainOrderId: mainOrder.id })
                .andWhere("sideOrder.id != :sideOrderId", { sideOrderId: order.id })
                .getOne();
            await closeOrder(otherSideOrders.orderId, symbol)
            console.log(otherSideOrders);

            await AppDataSource.getRepository(MainOrder)
                .createQueryBuilder("mainOrder")
                .delete()
                .where("mainOrder.id = :mainOrderId", { mainOrderId: mainOrder.id })
                .execute();

            console.log(`order: ${order.orderId} (${symbol}) is closed!`);
        }
    }
}