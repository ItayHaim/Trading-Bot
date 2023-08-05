import { AppDataSource } from "../data-source";
import { Currency } from "../entity/Currency";
import { Order } from "../entity/Order";
import { OrderType } from "../enums";
import { createOrder, getOrder, getQuoteAmount, isOrderFilled } from "../operations/exchangeOperations";

export const strategyExample = async () => {
    try {
        // const usdtAmount = Number(process.env.USDT_AMOUNT)

        // const currency = await AppDataSource.manager.findOneOrFail(Currency, {
        //     where: { symbol: 'BTC/USDT' }
        // })

        // const amount = await getQuoteAmount(currency.symbol, usdtAmount)
        // const order = await createOrder(currency.symbol, 'buy', amount)

        // // Save the order in database
        // await AppDataSource.manager.save(Order, {
        //     orderId: order.mainOrderId,
        //     orderType: OrderType.Main,
        //     symbol: currency
        // })
        // await AppDataSource.manager.save(Order, {
        //     orderId: order.StopLossId,
        //     orderType: OrderType.StopLoss,
        //     symbol: currency,
        // })
        // await AppDataSource.manager.save(Order, {
        //     orderId: order.TakeProfitId,
        //     orderType: OrderType.TakeProfit,
        //     symbol: currency
        // })

        // const first = await isOrderFilled(order.mainOrderId, currency.symbol)
        // // console.log('order first ', first);

        // const second = await getOrder(order.mainOrderId, currency.symbol)
        // // console.log('order second ', second);

        // return first
    } catch (err) {
        console.log('Strategy Failed: ');
        console.log(err);
    }
}