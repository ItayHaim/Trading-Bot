import { AppDataSource } from "./data-source";
import { SideOrder } from "./entity/SideOrder";
import { OrderStatus } from "./enums";
import { closeOrder } from "./operation/exchangeOperations";
import { CandleStickService } from "./service/candlestick.service";
import { OrderService } from "./service/order.service";
import { strategy } from "./strategy/strategy";

export const main = async () => {
    try {
        const candleStickService = new CandleStickService()
        const orderService = new OrderService()

        setInterval(async () => {
            candleStickService.addOneCandle()
        }, 1000 * 60 * 5) // 5 minutes
        setInterval(async () => {
            orderService.checkOrders()
        }, 1000 * 2) // 2 seconds

        setTimeout(async () => {
            const orders = await AppDataSource.manager.find(SideOrder, {
                where: { status: OrderStatus.Open },
                relations: { mainOrder: { currency: true } }
            })
            const close1 = await closeOrder(orders[0].orderId, orders[0].mainOrder.currency.symbol)
            console.log('close1:' + close1);
        }, 1000 * 15)

        strategy()
    } catch (err) {
        console.log(err);
        AppDataSource.destroy()
    }
}
