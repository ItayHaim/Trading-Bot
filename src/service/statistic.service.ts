import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import statistic from '../statistic.json';
import { AppDataSource } from '../data-source';
import { Statistic } from '../entity/Statistic';
import { MoreThanOrEqual } from 'typeorm';

export class StatisticService {
    private filePath = resolve('src/statistic.json')

    async addSuccess() {
        try {
            await AppDataSource.manager.increment(Statistic, undefined, 'success', 1);
            // .createQueryBuilder()
            // .update(Statistic)
            // .set({ success: () => "success + 1" })
            // .execute();
        } catch (err) {
            console.error('Error writing to file: ' + err)
            throw err
        }
    }

    async addFailed() {
        try {
            statistic.failed++;
            await writeFile(this.filePath, JSON.stringify(statistic), 'utf-8');
        } catch (err) {
            console.error('Error writing to file: ' + err)
            throw err
        }
    }


}