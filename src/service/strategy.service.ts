import { Currency } from "../entity/Currency";
import { BuyOrSell } from "../enums";
import { WaitingCrossesArrayType } from "../types";
import { IndicatorService } from "./indicator.service";
import { OrderService } from "./order.service";

export class StrategyService {
    private orderService = new OrderService()
    private indicatorService = new IndicatorService()

    async indicatorsStrategy(closedPrices: number[], currency: Currency): Promise<void> {
        try {
            const { symbol } = currency

            const RSI = this.indicatorService.checkRSI(closedPrices)
            const StochRSI = this.indicatorService.checkStochasticRSI(closedPrices)
            const BB = this.indicatorService.checkBolingerBands(closedPrices)

            if (
                RSI === BuyOrSell.Buy
                &&
                StochRSI === BuyOrSell.Buy
                &&
                BB === BuyOrSell.Buy
            ) {
                await this.orderService.createFullOrder(currency, BuyOrSell.Buy)
                console.log('Should create buy order ' + symbol);
            } else if (
                RSI === BuyOrSell.Sell
                &&
                StochRSI === BuyOrSell.Sell
                &&
                BB === BuyOrSell.Sell
            ) {
                await this.orderService.createFullOrder(currency, BuyOrSell.Sell)
                console.log('Should create sell order ' + symbol);
            } else {
                console.log('Should NOT create order ' + symbol);
            }
        } catch (err) {
            console.error('Failed to run indicator strategy: ' + err)
            throw err
        }
    }

    async MACDCrossesAndBBStrategy(waitingOrders: WaitingCrossesArrayType[]) {
        try {
            waitingOrders.sort((a, b) => b.MACDDiff - a.MACDDiff)
            console.log('✌️waitingOrders --->', waitingOrders);

            for (let index in waitingOrders) {
                const order = waitingOrders[index]
                await this.orderService.createFullOrder(order.currency, order.buyOrSell)
            }
        } catch (err) {
            console.error('Failed to run cross and BB strategy: ' + err)
            throw err
        }
    }

    async MACrossesStrategy(waitingOrders: WaitingCrossesArrayType[]) {
        try {
            console.log('✌️waitingOrders --->', waitingOrders);
            
            for (let index in waitingOrders) {
                const order = waitingOrders[index]
                await this.orderService.createFullOrder(order.currency, order.buyOrSell)
            }
        } catch (err) {
            console.error('Failed to run MA cross strategy: ' + err)
            throw err
        }
    }
}