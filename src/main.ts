import { NetworkError, OrderNotFound } from "ccxt";
import { AppDataSource } from "./data-source";
import { MainOrder } from "./entity/MainOrder";
import { BuyOrSell, OrderStatus } from "./enums";
import { closeAllOrdersBySymbol, closeOrder } from "./operation/exchangeOperations";
import { CandleStickService } from "./service/candlestick.service";
import { OrderService } from "./service/order.service";
import { crossStrategy } from "./strategy/crossStrategy";
import { Currency } from "./entity/Currency";
import { SideOrder } from "./entity/SideOrder";

export const main = async () => {
    try {
        const candleStickService = new CandleStickService()
        const orderService = new OrderService()

        await crossStrategy()

        setInterval(async () => {
            await candleStickService.addOneCandle();
            await orderService.checkOrderByTime()
            const canCreateOrder = await orderService.canCreateOrder()
            canCreateOrder && await crossStrategy()
        }, 1000 * 60 * 5) // 5 minutes

        setInterval(async () => {
            await orderService.checkOrdersStatus()
        }, 1000 * 5) // 5 seconds

        // const currency = await AppDataSource.manager.findOne(Currency, {
        //     where: { symbol: 'ATOM/USDT' }
        // })
        // await orderService.createFullOrder(currency, BuyOrSell.Buy)
        // setInterval(async () => {
        //     await orderService.checkOrderByTime()
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
