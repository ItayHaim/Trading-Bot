# Trading-Bot-New

This repository contains the codebase for the Trading Bot. You can setup and run this bot in your local environment by following the steps below.

---

## Prerequisites

Make sure you have [Node.js](http://nodejs.org/) and npm installed.

---

## Installation Steps

1. Clone the repository:

`git clone https://github.com/ItayHaim/Trading-Bot-New.git`

2. Navigate into the project directory:

`cd Trading-Bot-New`

3. Install the dependencies:

`npm install`


---

## Database Setup

- Create a new schema in your MySQL server named `trading_bot`.

---

## Binance Setup

- Sign in to your account in Binance.
- Generate API and Secret keys (make sure to enable the Futures Trading on your account).
- Save these keys as you will need these in the next steps.

---

## Configuring Your Bot

- Rename the `.env.template` file to `.env`.
- Open the `.env` file and customize the fields. 
- Make sure you have enough balance in your USDT wallet:

` USDT_AMOUNT * OPEN_ORDER_ALLOWED * 2 < Your USDT Balance`

  Adjust the `USDT_AMOUNT` and `OPEN_ORDER_ALLOWED` in your `.env` file accordingly.

---

## Starting the Bot

- After completing the steps above, you are now ready to run the bot:

`npm start`


---

## Contributing

If you wish to contribute to this project, please make sure to follow our [Contributing Guide](CONTRIBUTING.md).

---

## License

This project is licensed under [MIT License](LICENSE).

---

## Acknowledgement

This bot is built using Node.js for the server side, and utilizes the ccxt npm package for trading functions. 

---
