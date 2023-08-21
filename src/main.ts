import { AppDataSource } from "./data-source";
import { MainOrder } from "./entity/MainOrder";
import { OrderStatus } from "./enums";
import { closeAllOrdersBySymbol } from "./operation/exchangeOperations";
import { CandleStickService } from "./service/candlestick.service";
import { OrderService } from "./service/order.service";
import { crossStrategy } from "./strategy/crossStrategy";

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
        // const sideOrder = await AppDataSource.manager.find(SideOrder, {
        //     relations: { mainOrder: { currency: true } }
        // })
        // setTimeout(async () => {
        //     await closeOrder(sideOrder[0].orderId, 'ATOM/USDT')
        // }, 1010 * 60 )

    } catch (err) {
        console.log(err);
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
