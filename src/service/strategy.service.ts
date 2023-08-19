import { Currency } from "../entity/Currency";
import { BuyOrSell, CrossIndicator } from "../enums";
import { IndicatorService } from "./indicator.service";
import { OrderService } from "./order.service";

export class StrategyService {
    private orderService = new OrderService()
    private indicatorService = new IndicatorService()

    async indicatorsStrategy(closedPrices: number[], currency: Currency): Promise<void> {
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
    }

    async crossesStrategy(closedPrices: number[], crossIndicator: CrossIndicator, currency: Currency): Promise<void> {
        const { symbol } = currency

        const res = this.indicatorService.checkCrosses(closedPrices, crossIndicator)
        if (res === BuyOrSell.Buy) {
            await this.orderService.createFullOrder(currency, BuyOrSell.Buy)
            console.log('Should create buy order ' + symbol);
        } else if (res === BuyOrSell.Sell) {
            await this.orderService.createFullOrder(currency, BuyOrSell.Sell)
            console.log('Should create sell order ' + symbol);
        } else {
            console.log('Should NOT create order ' + symbol);
        }
    }
}