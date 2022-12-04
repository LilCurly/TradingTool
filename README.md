# Roman's Trading Tool

I made this little trading tool to help me manage my risk, it's not perfect but I made it for my needs, it might not work for your needs, use it at your own risk.
It works only with Binance Futures.

To make it work locally,
- Clone the repository
- Create a file named .env.production at the root with the following values
```
REACT_APP_BASE_URL=https://fapi.binance.com
REACT_APP_WEBSOCKET_URL=wss://fstream.binance.com
REACT_APP_BINANCE_KEY=[YOUR BINANCE API KEY]
REACT_APP_BINANCE_SECRET=[YOUR BINANCE SECRET KEY]
```
- Run these commands
```
npm run build
npm install serve
serve -s build
```
- Access the tool at http://localhost:3000/

As there is no backend with this project, you either need to use your own or use a proxy to forward orders endpoint calls (THIS IS NOT SAFE! USE AT YOUR OWN RISK!), otherwise you will have CORS issues. The project is currently configured to use a local proxy (cors-anywhere is a nodejs library that can help you with that.)

## Use in a TEST environment

If you intend to you this tool, I strongly advise to use it in a TEST environment first. And once again, use it at your own risk!

To configure a test environment,
- Create an account at binance's futures testnet platform and get your keys
- Create a file named .env.development at the root with the following values
```
REACT_APP_BASE_URL=https://testnet.binancefuture.com
REACT_APP_WEBSOCKET_URL=wss://stream.binancefuture.com
REACT_APP_BINANCE_KEY=[YOUR BINANCE TESTNET API KEY]
REACT_APP_BINANCE_SECRET=[YOUR BINANCE TESTNET SECRET KEY]
```
- Run that command
```
npm start
```
- Access the tool at http://localhost:3000/

By doing that you will access Binance's TESTNET instead of the PROD environment.

Remember that trading comes with a great risk, even more when trading cryptocurrencies, if you do not know what you're doing you should stay away. Never share your keys with anyone.