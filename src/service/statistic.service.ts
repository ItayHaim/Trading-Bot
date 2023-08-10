import { writeFileSync } from 'fs';
import statistic from '../statistic.json';

export class StatisticService {
    async addSuccess() {
        try {
            console.log('Before increment:', statistic);
            statistic.success++;
            console.log('After increment:', statistic);
            writeFileSync('../statistic.json', JSON.stringify(statistic), 'utf-8');
        } catch (error) {
            console.error('Error writing to file:', error);
        }
    }
}