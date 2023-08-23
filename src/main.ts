import { NetworkError, OrderNotFound } from "ccxt";
import { AppDataSource } from "./data-source";
import { MainOrder } from "./entity/MainOrder";
import { BuyOrSell, OrderStatus, OrderType } from "./enums";
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
        let isCheckingOrders = false;

        await crossStrategy()

        setInterval(async () => {
            await candleStickService.addOneCandle()
            if (!isCheckingOrders) {
                isCheckingOrders = true;
                await orderService.checkOrderTime()
                isCheckingOrders = false;
            }
            const canCreateOrder = await orderService.canCreateOrder()
            canCreateOrder && await crossStrategy()
        }, 1000 * 60 * 5) // 5 minutes

        setInterval(async () => {
            if (!isCheckingOrders) {
                isCheckingOrders = true;
                await orderService.checkOrdersStatus()
                isCheckingOrders = false;
            }
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
