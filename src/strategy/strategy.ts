import { AppDataSource } from "../data-source";
import { CandleStick } from "../entity/CandleStick";
import { Currency } from "../entity/Currency";

export const strategy = async () => {
    try {
        const currencies = await AppDataSource.manager.find(Currency)

        console.log(currencies);

        for (const currency in currencies) {
            const symbol = currencies[currency]

            console.log(symbol);
            const candles = await AppDataSource.manager.find(CandleStick, {
                where: { currency: symbol }
            })
            console.log(candles);
        }

    } catch (err) {
        console.log('Strategy Failed: ' + err);
    }
}