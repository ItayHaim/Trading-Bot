import { OrderStatus } from "../consts";
import { AppDataSource } from "../data-source";
import { Order } from "../entity/Order";
import { createOrder, getQuoteAmount, isOrderFilled } from "../operations/exchangeOperations";

export const strategyExample = async () => {
    try {
        // const usdtAmount = Number(process.env.USDT_AMOUNT)

        // const amount = await getQuoteAmount('BTC/USDT', usdtAmount)
        // const order = await createOrder('BTC/USDT', 'buy', amount)
        // AppDataSource.manager.save(Order, {
        //     orderId: order.id,
        // })
        // console.log(order);
        

        // const res = await isOrderFilled(order.id)
        // console.log(res);

        // return res
    } catch (err) {
        console.log('Strategy Failed: ');
        console.log(err);
    }
}