import { AppDataSource } from "../data-source"
import { Currency } from "../entity/Currency"
import { MainOrder } from "../entity/MainOrder"
import { SideOrder } from "../entity/SideOrder"
import { BuyOrSell, OrderStatus, OrderType } from "../enums"
import { binanceExchange } from "../operation/exchange"
import { closeOrder, createOrder, getQuoteAmount, isOrderFilled } from "../operation/exchangeOperations"

export class OrderService {
    private usdtAmount = Number(process.env.USDT_AMOUNT)

    async createFullOrder(currency: Currency, orderSide: BuyOrSell): Promise<void> {
        try {
            const { symbol } = currency

            const amount = await getQuoteAmount(symbol, this.usdtAmount)
            const { StopLossId, TakeProfitId, mainOrderId } = await createOrder(symbol, orderSide, amount)

            const mainOrder = await AppDataSource.manager.save(MainOrder, {
                orderId: mainOrderId,
                amount: amount,
                buyOrSell: orderSide,
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

    async checkOrders(): Promise<void> {
        const orders = await AppDataSource.manager.find(SideOrder, {
            where: { status: OrderStatus.Open },
            relations: { mainOrder: { currency: true } }
        })

        for (const order of orders) {
            const { mainOrder } = order
            const { currency, buyOrSell, amount } = mainOrder
            const { symbol } = currency

            const status = await isOrderFilled(order.orderId, symbol)
            console.log(status);

            if (status === OrderStatus.Closed || status === OrderStatus.Canceled) {
                // Close the position
                const closePositionSide = buyOrSell === 'buy' ? 'sell' : 'buy'
                await binanceExchange.createOrder(symbol, 'market', closePositionSide, amount, null, { 'reduceOnly': true })

                // Find the other SideOrder (TP/SL) to close him
                const otherSideOrder = await AppDataSource.getRepository(SideOrder)
                    .createQueryBuilder("sideOrder")
                    .where("sideOrder.mainOrder = :mainOrderId", { mainOrderId: mainOrder.id })
                    .andWhere("sideOrder.id != :sideOrderId", { sideOrderId: order.id })
                    .getOne();
                await closeOrder(otherSideOrder.orderId, symbol)

                //Delete orders from DB
                await AppDataSource.getRepository(MainOrder)
                    .createQueryBuilder("mainOrder")
                    .delete()
                    .where("id = :mainOrderId", { mainOrderId: mainOrder.id })
                    .execute();

                console.log(`order: ${mainOrder.orderId} (${symbol}) is closed!`);
                break;
            }
        }
    }
}
