import { AppDataSource } from '../data-source';
import { Statistic } from '../entity/Statistic';

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
}