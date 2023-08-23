import { AppDataSource } from '../data-source';
import { Statistic } from '../entity/Statistic';
import { OrderType } from '../enums';

export class StatisticService {
    async addSuccess() {
        try {
            await AppDataSource.manager.increment(Statistic, {}, 'success', 1);
        } catch (err) {
            console.error('Error writing to file: ' + err)
            throw err
        }
    }

    async addFailed() {
        try {
            await AppDataSource.manager.increment(Statistic, {}, 'failed', 1);
        } catch (err) {
            console.error('Error writing to file: ' + err)
            throw err
        }
    }

    async saveOrderStatistic(PNL: number, orderType: OrderType) {
        try {
            PNL
                ? PNL > 0
                    ? this.addSuccess()
                    : this.addFailed()
                : orderType === OrderType.TakeProfit
                    ? this.addSuccess()
                    : this.addFailed()
        } catch (err) {
            console.error('Error saving order in statistic: ' + err)
            throw err
        }
    }
}