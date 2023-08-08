import { AppDataSource } from "./data-source";
import { addOneCandle, checkOrders } from "./function/DataBaseOperations";
import { strategy } from "./strategy/strategy";

export const main = async () => {
    try {
        setInterval(async () => {
            addOneCandle()
        }, 1000 * 60 * 5) // 5 minutes
        setInterval(async () => {
            checkOrders()
        }, 1000 * 2) // 5 seconds

        // setTimeout(async () => {
        //     const orders = await AppDataSource.manager.find(SideOrder, {
        //         where: { status: OrderStatus.Open },
        //         relations: { mainOrder: { currency: true } }
        //     })
        //     const close1 = await closeOrder(orders[0].orderId, orders[0].mainOrder.currency.symbol)
        //     console.log('close1:' + close1);
        // }, 1000 * 15)

        strategy()
    } catch (err) {
        console.log(err);
        AppDataSource.destroy()
    }
}
