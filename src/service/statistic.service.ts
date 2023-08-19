import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import statistic from '../statistic.json';

export class StatisticService {
    private filePath = resolve('src/statistic.json')

    async addSuccess() {
        try {
            statistic.success++;
            await writeFile(this.filePath, JSON.stringify(statistic), 'utf-8');
        } catch (error) {
            console.error('Error writing to file:', error);
        }
    }

    async addFailed() {
        try {
            statistic.failed++;
            await writeFile(this.filePath, JSON.stringify(statistic), 'utf-8');
        } catch (error) {
            console.error('Error writing to file:', error);
        }
    }
}