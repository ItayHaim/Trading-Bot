import { AppDataSource } from "../data-source"
import { Currency } from "../entity/Currency"
import { MainOrder } from "../entity/MainOrder"
import { SideOrder } from "../entity/SideOrder"
import { BuyOrSell, OrderStatus, OrderType } from "../enums"
import { binanceExchange } from "../operation/exchange"
import { closeOrder, createOrder, getPositionPNL, getQuoteAmount, isOrderFilled } from "../operation/exchangeOperations"
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
            // Check if can create an order (according to openOrderAllowed)
            const canCreateOrder = await this.canCreateOrder()
            if (canCreateOrder === false) {
                return
            }

            //Check if order is already existing on this symbol
            const existingOrder = await AppDataSource.manager.findOne(MainOrder, {
                where: { currency: currency }
            })
            if (existingOrder) {
                console.log(`Order on this symbol ${currency.symbol} already exists`)
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

    async checkOrdersStatus(): Promise<void> {
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

            if (status === OrderStatus.Closed || status === OrderStatus.Canceled) {
                this.closeOrderAutomatically(order)
                break;
            }
        }
    }

    async closeOrderAutomatically(sideOrder: SideOrder): Promise<void> {
        try {
            const { mainOrder } = sideOrder
            const { currency } = mainOrder
            const { symbol } = currency

            // Find the other SideOrder (TP/SL) to close him
            const otherSideOrder = await AppDataSource.getRepository(SideOrder)
                .createQueryBuilder("sideOrder")
                .where("sideOrder.mainOrder = :mainOrderId", { mainOrderId: mainOrder.id })
                .andWhere("sideOrder.id != :sideOrderId", { sideOrderId: sideOrder.id })
                .getOne();
            await closeOrder(otherSideOrder.orderId, symbol)

            //Delete orders from DB
            await AppDataSource.getRepository(MainOrder)
                .createQueryBuilder("mainOrder")
                .delete()
                .where("id = :mainOrderId", { mainOrderId: mainOrder.id })
                .execute();

            // Add order to statistic
            sideOrder.orderType === OrderType.TakeProfit
                ? this.statisticService.addSuccess()
                : this.statisticService.addFailed()

            console.log(`order: ${mainOrder.orderId} (${symbol}) is closed!`);
        } catch (err) {
            console.log(err);
            console.log('Failed to close order!!');
        }
    }

    async closeOrderManually(mainOrder: MainOrder, PNL: number): Promise<void> {
        try {
            const { currency, buyOrSell, amount, sideOrders } = mainOrder
            const { symbol } = currency

            // Close the position
            const closePositionSide = buyOrSell === 'buy' ? 'sell' : 'buy'
            await binanceExchange.createOrder(symbol, 'market', closePositionSide, amount, null, { 'reduceOnly': true })

            // Close all the side orders
            for (const index in sideOrders) {
                const { orderId } = sideOrders[index]
                await closeOrder(orderId, symbol)
            }

            // Delete order (include TP/SL) from DB
            await AppDataSource.getRepository(MainOrder)
                .createQueryBuilder("mainOrder")
                .delete()
                .where("id = :mainOrderId", { mainOrderId: mainOrder.id })
                .execute();

            // Add order to statistic
            PNL > 0
                ? this.statisticService.addSuccess()
                : this.statisticService.addFailed()

            console.log(`order: ${mainOrder.orderId} (${symbol}) is closed!`);
        } catch (err) {
            console.log(err);
            console.log('Failed to close order!!');
        }
    }

    async checkOrderByTime() {
        const orders = await AppDataSource.manager.find(MainOrder, {
            where: { status: OrderStatus.Open },
            relations: { currency: true, sideOrders: true }
        })
        const currentTime = new Date();

        // Run over all the main orders and check if they're open more than 40 minutes
        for (const index in orders) {
            const order = orders[index]
            const { createdAt, currency } = order
            const { symbol } = currency

            const timeDifference = (currentTime.getTime() - createdAt.getTime()) / (1000 * 60)

            if (timeDifference >= 40) {
                const PNL = await getPositionPNL(symbol)
                await this.closeOrderManually(order, PNL)
            }
        }
    }

    async canCreateOrder(): Promise<boolean> {
        // Limit number of orders on the same time (depend on the balance of USDT you have)
        // You supposed to hold this equation: 
        // (USDT_AMOUNT * OPEN_ORDER_ALLOWED * 2 < USDT Balance)!!!
        const amountOfOrders = await AppDataSource.manager.count(MainOrder)
        if (amountOfOrders >= this.openOrdersAllowed) {
            return false
        }
        return true
    }
}
