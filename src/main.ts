import { AppDataSource } from "./data-source";
import { CandleStickService } from "./service/candlestick.service";
import { OrderService } from "./service/order.service";
import { strategy } from "./strategy/strategy";

export const main = async () => {
    try {
        const candleStickService = new CandleStickService()
        const orderService = new OrderService()

        await strategy()

        setInterval(async () => {
            await candleStickService.addOneCandle()
            await strategy()
        }, 1000 * 60 * 5) // 5 minutes

        setInterval(async () => {
            await orderService.checkOrders()
        }, 1000 * 5) // 5 seconds


        // Temp checking to createFullOrder function 
        // setTimeout(async () => {
        //     const orders = await AppDataSource.manager.find(SideOrder, {
        //         where: { status: OrderStatus.Open },
        //         relations: { mainOrder: { currency: true } }
        //     })
        //     await closeOrder(orders[0].orderId, orders[0].mainOrder.currency.symbol)
        // }, 1000 * 15)

    } catch (err) {
        console.log(err);
        AppDataSource.destroy()
    }
}
