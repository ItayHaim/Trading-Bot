import { binance } from "ccxt";
require('dotenv').config();

export const binanceExchange: binance = new binance({
    apiKey: process.env.API_KEY,
    secret: process.env.SECRET_KEY,
    enableRateLimit: true,
    timeout: 20000, // Change the RequestError to be pooped after 20s
    // verbose: true // Make every response send with headers  
    options: {
        defaultType: 'future',
        warnOnFetchOpenOrdersWithoutSymbol: false
    }
});