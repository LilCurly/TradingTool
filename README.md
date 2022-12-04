# Roman's Trading Tool

I made this little trading tool to help me manage my risk, it's not perfect but I made it for my needs, it might not work for your needs, use it at your own risk.

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