import { Currency } from "../entity/Currency";
import { BuyOrSell } from "../enums";
import { WaitingLinearRegArrayType, WaitingMACDCrossArrayType, WaitingMACrossArrayType } from "../types";
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

    async MACDCrossesAndBBStrategy(waitingOrders: WaitingMACDCrossArrayType[]) {
        try {
            waitingOrders.sort((a, b) => b.MACDDiff - a.MACDDiff)
            console.log('✌️waitingOrders --->', waitingOrders);

            for (const index in waitingOrders) {
                const order = waitingOrders[index]
                await this.orderService.createFullOrder(order.currency, order.buyOrSell)
            }
        } catch (err) {
            console.error('Failed to run cross and BB strategy: ' + err)
            throw err
        }
    }

    async MACrossesStrategy(waitingOrders: WaitingMACrossArrayType[]) {
        try {
            console.log('✌️waitingOrders --->', waitingOrders);
            waitingOrders.sort((a, b) => {
                if (a.buyOrSell === BuyOrSell.Buy && b.buyOrSell === BuyOrSell.Buy) {
                    // For 'Buy', higher RSIValue should come first
                    return (b.RSIValue || 0) - (a.RSIValue || 0); // Assuming 0 as default RSIValue
                } else if (a.buyOrSell === BuyOrSell.Sell && b.buyOrSell === BuyOrSell.Sell) {
                    // For 'Sell', lower RSIValue should come first
                    return (a.RSIValue || 0) - (b.RSIValue || 0); // Assuming 0 as default RSIValue
                } else {
                    // If BuyOrSell values are not same, keep original order
                    return 0;
                }
            })
            console.log('✌️waitingOrders --->', waitingOrders);

            for (const index in waitingOrders) {
                const order = waitingOrders[index]
                await this.orderService.createFullOrder(order.currency, order.buyOrSell)
            }
        } catch (err) {
            console.error('Failed to run MA cross strategy: ' + err)
            throw err
        }
    }

    async LinearRegressionStrategy(waitingOrders: WaitingLinearRegArrayType[]) {
        try {
            waitingOrders.sort((a, b) => b.PricePercentageDiff - a.PricePercentageDiff)

            for (const index in waitingOrders) {
                const order = waitingOrders[index]
                await this.orderService.createFullOrder(order.currency, order.buyOrSell)
            }
        } catch (err) {
            console.error('Failed to run linear regression strategy: ' + err)
            throw err
        }
    }
}