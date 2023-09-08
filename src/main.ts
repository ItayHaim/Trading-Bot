import { NetworkError, OrderNotFound } from "ccxt";
import { AppDataSource } from "./data-source";
import { MainOrder } from "./entity/MainOrder";
import { OrderStatus } from "./enums";
import { closeAllOrdersBySymbol } from "./operation/exchangeOperations";
import { CandleStickService } from "./service/candlestick.service";
import { OrderService } from "./service/order.service";
import { linearRegressionStrategy } from "./strategy/LinearRegressionStrategy";

export const main = async () => {
    try {
        const candleStickService = new CandleStickService()
        const orderService = new OrderService()

        // await linearRegressionStrategy()

        setInterval(async () => {
            await candleStickService.addOneCandle()
            const canCreateOrder = await orderService.canCreateOrder()
            canCreateOrder && await linearRegressionStrategy()
        }, 1000 * 60 * 5) // 5 minutes

        setInterval(async () => {
            await orderService.checkOrdersStatus()
        }, 1000 * 10) // 10 seconds
        
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
