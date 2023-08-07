import { AppDataSource } from "../data-source"
import { Currency } from "../entity/Currency"
import { MainOrder } from "../entity/MainOrder"
import { SideOrder } from "../entity/SideOrder"
import { OrderType } from "../enums"
import { createOrder, getQuoteAmount } from "../operation/exchangeOperations"

export class OrderService {
    private usdtAmount = Number(process.env.USDT_AMOUNT)

    async createFullOrder(currency: Currency) {
        try {
            const amount = await getQuoteAmount(currency.symbol, this.usdtAmount)
            const { StopLossId, TakeProfitId, mainOrderId } = await createOrder(currency.symbol, 'buy', amount)

            await AppDataSource.manager.save(MainOrder, {
                orderId: mainOrderId,
                symbol: currency
            })
            await AppDataSource.manager.save(SideOrder, {
                orderId: StopLossId,
                orderType: OrderType.StopLoss,
                symbol: currency,
            })
            await AppDataSource.manager.save(SideOrder, {
                orderId: TakeProfitId,
                orderType: OrderType.TakeProfit,
                symbol: currency
            })
            console.log('Order created successfully');
        } catch (error) {
            console.log('Order did NOT save in DB!');
        }
    }
}
