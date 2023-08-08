import { AppDataSource } from "../data-source";
import { Currency } from "../entity/Currency";
import { OrderService } from "../service/main-order.serveice";

export const strategy = async () => {
    try {
        const orderService = new OrderService()

        const currency = await AppDataSource.manager.findOneOrFail(Currency, {
            where: { symbol: 'BTC/USDT' }
        })

        // await orderService.createFullOrder(currency)

    } catch (err) {
        console.log('Strategy Failed: ');
        console.log(err);
    }
}