import { AppDataSource } from "../data-source";
import { Currency } from "../entity/Currency";
import { OrderService } from "../service/order.service";

export const strategy = async () => {
    try {
        const orderService = new OrderService()

        const currency = await AppDataSource.manager.findOneOrFail(Currency, {
            where: { symbol: 'BTC/USDT' }
        })

    } catch (err) {
        console.log('Strategy Failed: ');
        console.log(err);
    }
}