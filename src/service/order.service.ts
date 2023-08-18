import { AppDataSource } from "../data-source"
import { Currency } from "../entity/Currency"
import { MainOrder } from "../entity/MainOrder"
import { SideOrder } from "../entity/SideOrder"
import { BuyOrSell, OrderStatus, OrderType } from "../enums"
import { binanceExchange } from "../operation/exchange"
import { closeOrder, createOrder, getQuoteAmount, isOrderFilled } from "../operation/exchangeOperations"
import { StatisticService } from "./statistic.service"

export class OrderService {
    private usdtAmount = Number(process.env.USDT_AMOUNT)
    private openOrdersAllowed = Number(process.env.OPEN_ORDER_ALLOWED)
    private statisticService = new StatisticService()

    async calculateOrderUSDTAmount(symbol: string): Promise<number> {
        const amount = await getQuoteAmount(symbol, this.usdtAmount)
        return amount
    }

    async createFullOrder(currency: Currency, orderSide: BuyOrSell): Promise<void> {
        try {
            //Check if order is already existing on this symbol
            const existingOrder = await AppDataSource.manager.findOne(MainOrder, {
                where: { currency: currency }
            })
            if (existingOrder) {
                console.log(`Order on this symbol ${currency.symbol} already exists`)
                return
            }

            // Limit number of orders on the same time (depend on the balance of USDT you have)
            // You supposed to hold this equation: 
            // (USDT_AMOUNT * OPEN_ORDER_ALLOWED * 2 < USDT Balance)!!!
            const amountOfOrders = await AppDataSource.manager.count(MainOrder)
            if (amountOfOrders >= this.openOrdersAllowed) {
                console.log('Too many orders are open!!');
                return
            }

            // Create main order (include SL/TP) and save them in DB
            const { symbol } = currency
            const amount = await this.calculateOrderUSDTAmount(symbol)
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
            console.log('Order did NOT save in DB!' + error);
        }
    }

    async checkOrders(): Promise<void> {
        const orders = await AppDataSource.manager.find(SideOrder, {
            where: { status: OrderStatus.Open },
            relations: { mainOrder: { currency: true } }
        })

        // Run over all the SL/TP orders and check if they're closed/canceled
        for (const order of orders) {
            const { mainOrder } = order
            const { currency } = mainOrder
            const { symbol } = currency

            const status = await isOrderFilled(order.orderId, symbol)
            console.log(`${symbol} order : ${status}`);

            if (status === OrderStatus.Closed || status === OrderStatus.Canceled) {
                this.closeOrderFull(order)
                break;
            }
        }
    }

    async closeOrderFull(order: SideOrder): Promise<void> {
        try {
            const { mainOrder } = order
            const { currency, buyOrSell, amount } = mainOrder
            const { symbol } = currency

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

            // Add order to statistic
            order.orderType === OrderType.TakeProfit
                ? this.statisticService.addSuccess()
                : this.statisticService.addFailed()

            console.log(`order: ${mainOrder.orderId} (${symbol}) is closed!`);
        } catch (err) {
            console.log(`Failed to close order!!`);
        }
    }
}
