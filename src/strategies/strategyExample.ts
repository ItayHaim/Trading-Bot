import { AppDataSource } from "../data-source";
import { Order } from "../entity/Order";
import { createOrder, getQuoteAmount, isOrderFilled } from "../operations/exchangeOperations";

export const strategyExample = async () => {
    try {
        const usdtAmount = Number(process.env.USDT_AMOUNT)

        const amount = await getQuoteAmount('BTC/USDT', usdtAmount)
        const { id } = await createOrder('BTC/USDT', 'buy', amount)
        AppDataSource.manager.save(Order, {
            orderId: id
        })

        const res = await isOrderFilled(id)
        console.log(res);

        return res
    } catch (err) {
        console.log('Strategy Failed: ');
        console.log(err);
    }
}