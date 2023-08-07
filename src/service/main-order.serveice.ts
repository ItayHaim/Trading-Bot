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

            const mainOrder = await AppDataSource.manager.save(MainOrder, {
                orderId: mainOrderId,
                currency: currency
            })
            await AppDataSource.manager.save(SideOrder, {
                orderId: StopLossId,
                orderType: OrderType.StopLoss,
                mainOrder: mainOrder
            })
            await AppDataSource.manager.save(SideOrder, {
                orderId: TakeProfitId,
                orderType: OrderType.TakeProfit,
                mainOrder: mainOrder
            })
            console.log('Order created successfully');
        } catch (error) {
            console.log('Order did NOT save in DB!');
        }
    }
}
