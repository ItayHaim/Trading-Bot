import { NetworkError, OrderNotFound } from "ccxt";
import { AppDataSource } from "./data-source";
import { MainOrder } from "./entity/MainOrder";
import { OrderStatus } from "./enums";
import { closeAllOrdersBySymbol } from "./operation/exchangeOperations";
import { CandleStickService } from "./service/candlestick.service";
import { OrderService } from "./service/order.service";
import { MACDCrossStrategy } from "./strategy/MACDCrossStrategy";
import { MACrossStrategy } from "./strategy/MACrossStrategy";

export const main = async () => {
    try {
        const candleStickService = new CandleStickService()
        const orderService = new OrderService()

        await MACrossStrategy()

        setInterval(async () => {
            await candleStickService.addOneCandle()

            const canCreateOrder = await orderService.canCreateOrder()
            canCreateOrder && await MACrossStrategy()
        }, 1000 * 60 * 5) // 5 minutes

        setInterval(async () => {
            await orderService.checkOrdersStatus()
        }, 1000 * 5) // 5 seconds

        // const currency = await AppDataSource.manager.findOne(Currency, {
        //     where: { symbol: 'ATOM/USDT' }
        // })
        // await orderService.createFullOrder(currency, BuyOrSell.Buy)
        // setInterval(async () => {
        //     await orderService.checkOrderTime()
        // }, 1000 * 5)
        // setInterval(async () => {
        //     const sideOrder = await AppDataSource.manager.findOne(SideOrder, {
        //         where: { orderType: OrderType.TakeProfit }

        //     })
        //     await closeOrder(sideOrder.orderId, 'ATOM/USDT')
        // }, 1000 * 20)

    } catch (err) {
        console.error(err);
        if (err instanceof NetworkError) {
            return
        }
        if (err instanceof OrderNotFound) {
            return
        }
        const openOrders = await AppDataSource.getRepository(MainOrder).find({
            where: { status: OrderStatus.Open },
            relations: { currency: true }
        })
        for (const index in openOrders) {
            const order = openOrders[index]
            const { currency } = order
            const { symbol } = currency
            await closeAllOrdersBySymbol(symbol)
        }
        AppDataSource.destroy()
    }
}
