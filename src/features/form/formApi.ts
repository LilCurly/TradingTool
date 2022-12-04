import { Symbols } from "./models/symbols"
import axios from "axios"
import { JsonConvert } from "json2typescript"
import * as Constants from "../../utils/constants"
import { Balance } from "./models/balance"
import hmacSHA256 from 'crypto-js/hmac-sha256';
import { Price } from "./models/price"
import { Order } from "./models/order"
import { Position } from "./models/position"

function signature(queryString: string): string {
    return hmacSHA256(queryString, process.env.REACT_APP_BINANCE_SECRET as string).toString()
}

export function fetchExchangeInformations() {
    return new Promise<Symbols>((resolve) => {
        axios.get(`${process.env.REACT_APP_BASE_URL}${Constants.ENDPOINT_SYMBOLS}`).then((response) => {
            if (response.status >= 200 && response.status < 300 && response.data) {
                let jsonConvert: JsonConvert = new JsonConvert()
                resolve(jsonConvert.deserializeObject(response.data, Symbols))
            }
        })
    })
}

export function setOneWayMode() {
    return new Promise<boolean>(() => {
        const params = {'dualSidePosition': 'false', 'timestamp': Date.now()}
        let queryString = Object.entries(params).map((key, value) => key.join('=')).join('&')
        const sign = signature(queryString)
        const config = {
            headers: {
                'X-MBX-APIKEY': process.env.REACT_APP_BINANCE_KEY
            },
            params: {
                ...params,
                'signature': sign
            }
        }

        axios.post(`${process.env.REACT_APP_BASE_URL}${Constants.ENDPOINT_POSITION_MODE}`, null, config)
    })
}

export function setIsolatedMarginType(symbol: string) {
    return new Promise<boolean>(() => {
        const params = {'symbol': symbol, 'marginType': 'ISOLATED', 'timestamp': Date.now()}
        let queryString = Object.entries(params).map((key, value) => key.join('=')).join('&')
        const sign = signature(queryString)
        const config = {
            headers: {
                'X-MBX-APIKEY': process.env.REACT_APP_BINANCE_KEY
            },
            params: {
                ...params,
                'signature': sign
            }
        }

        axios.post(`${process.env.REACT_APP_BASE_URL}${Constants.ENDPOINT_MARGIN_TYPE}`, null, config)
    })
}

export function hasOrders(symbol: string) {
    return new Promise<boolean>((resolve) => {
        const params = {'symbol': symbol, 'timestamp': Date.now()}
        let queryString = Object.entries(params).map((key, value) => key.join('=')).join('&')
        const sign = signature(queryString)
        const config = {
            headers: {
                'X-MBX-APIKEY': process.env.REACT_APP_BINANCE_KEY
            },
            params: {
                ...params,
                'signature': sign
            }
        }

        axios.get(`${process.env.REACT_APP_BASE_URL}${Constants.ENDPOINT_OPEN_ORDERS}`, config).then((response) => {
            if (response.status >= 200 && response.status < 300 && response.data) {
                let jsonConvert: JsonConvert = new JsonConvert()
                resolve(jsonConvert.deserializeArray(response.data, Order).length > 0)
            } else {
                resolve(false)
            }
        })
    })
}

export function fetchCurrentSymbolPrice(symbol: string) {
    return new Promise<Price>((resolve) => {
        const params = {'symbol': symbol}
        const config = {
            params: {
                ...params
            }
        }
        axios.get(`${process.env.REACT_APP_BASE_URL}${Constants.ENDPOINT_PRICE_TICKER}`, config).then((response) => {
            if (response.status >= 200 && response.status < 300 && response.data) {
                let jsonConvert: JsonConvert = new JsonConvert()
                resolve(jsonConvert.deserializeObject(response.data, Price))
            }
        })
    })
}

export function fetchAvailableAmount() {
    return new Promise<Balance | undefined>((resolve) => {
        const params = {'timestamp': Date.now()}
        let queryString = Object.entries(params).map((key, value) => key.join('=')).join('&')
        const sign = signature(queryString)
        const config = {
            headers: {
                'X-MBX-APIKEY': process.env.REACT_APP_BINANCE_KEY
            },
            params: {
                ...params,
                'signature': sign
            }
        }

        axios.get(`${process.env.REACT_APP_BASE_URL}${Constants.ENDPOINT_BALANCE}`, config).then((response) => {
            if (response.status >= 200 && response.status < 300 && response.data) {
                let jsonConvert: JsonConvert = new JsonConvert()
                let balances = jsonConvert.deserializeArray(response.data, Balance)
                resolve(balances.find((v, i, arr) => {
                    return v.asset == "USDT"
                }))
            }
        })
    })
}

export function fetchPositions() {
    return new Promise<Position[] | undefined>((resolve) => {
        const params = {'timestamp': Date.now()}
        let queryString = Object.entries(params).map((key, value) => key.join('=')).join('&')
        const sign = signature(queryString)
        const config = {
            headers: {
                'X-MBX-APIKEY': process.env.REACT_APP_BINANCE_KEY
            },
            params: {
                ...params,
                'signature': sign
            }
        }

        axios.get(`${process.env.REACT_APP_BASE_URL}${Constants.ENDPOINT_POSITIONS}`, config).then((response) => {
            if (response.status >= 200 && response.status < 300 && response.data) {
                let jsonConvert: JsonConvert = new JsonConvert()
                resolve(jsonConvert.deserializeArray(response.data, Position))
            }
        })
    })
}

export function updateLeverage(symbol: string, leverage: number) {
    return new Promise<boolean>((resolve, reject) => {
        const params = {'symbol': symbol, 'leverage': leverage, 'timestamp': Date.now()}
        let queryString = Object.entries(params).map((key, value) => key.join('=')).join('&')
        const sign = signature(queryString)
        const config = {
            headers: {
                'X-MBX-APIKEY': process.env.REACT_APP_BINANCE_KEY
            },
            params: {
                ...params,
                'signature': sign
            }
        }
        axios.post(`${process.env.REACT_APP_BASE_URL}${Constants.ENDPOINT_LEVERAGE}`, null, config).then((response) => {
            if (response.status >= 200 && response.status < 300 && response.data) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}

export function openLimitOrder(symbol: string, side: string, quantity: number, price: number) {
    return new Promise<boolean>((resolve, reject) => {
        const params = {'symbol': symbol, 'side': side == 'LONG' ? 'BUY' : 'SELL', 'type': 'LIMIT', 'timeInForce': 'GTC', 'quantity': quantity, 'price': price, 'timestamp': Date.now()}
        let queryString = Object.entries(params).map((key, value) => key.join('=')).join('&')
        const sign = signature(queryString)
        const config = {
            headers: {
                'X-MBX-APIKEY': process.env.REACT_APP_BINANCE_KEY
            },
            params: {
                ...params,
                'signature': sign
            }
        }

        axios.post(`http://localhost:8080/${process.env.REACT_APP_BASE_URL}${Constants.ENDPOINT_NEW_ORDER}`, null, config).then((response) => {
            if (response.status >= 200 && response.status < 300 && response.data) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}

export function openMarketOrder(symbol: string, side: string, quantity: number) {
    return new Promise<boolean>((resolve, reject) => {
        const params = {'symbol': symbol, 'side': side == 'LONG' ? 'BUY' : 'SELL', 'type': 'MARKET', 'quantity': quantity, 'timestamp': Date.now()}
        let queryString = Object.entries(params).map((key, value) => key.join('=')).join('&')
        const sign = signature(queryString)
        const config = {
            headers: {
                'X-MBX-APIKEY': process.env.REACT_APP_BINANCE_KEY
            },
            params: {
                ...params,
                'signature': sign
            }
        }

        axios.post(`http://localhost:8080/${process.env.REACT_APP_BASE_URL}${Constants.ENDPOINT_NEW_ORDER}`, null, config).then((response) => {
            if (response.status >= 200 && response.status < 300 && response.data) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}

export function openMarketStopLossOrder(symbol: string, side: string, quantity: number, price: number) {
    return new Promise<boolean>((resolve, reject) => {
        const params = {'symbol': symbol, 'side': side == 'LONG' ? 'SELL' : 'BUY', 'type': 'STOP_MARKET', 'timeInForce': 'GTE_GTC', 'quantity': quantity, 'stopPrice': price, 'workingType': 'MARK_PRICE', 'closePosition': true, 'timestamp': Date.now()}
        let queryString = Object.entries(params).map((key, value) => key.join('=')).join('&')
        const sign = signature(queryString)
        const config = {
            headers: {
                'X-MBX-APIKEY': process.env.REACT_APP_BINANCE_KEY
            },
            params: {
                ...params,
                'signature': sign
            }
        }

        axios.post(`http://localhost:8080/${process.env.REACT_APP_BASE_URL}${Constants.ENDPOINT_NEW_ORDER}`, null, config).then((response) => {
            if (response.status >= 200 && response.status < 300 && response.data) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}

export function openMarketTakeProfitOrder(symbol: string, side: string, quantity: number, price: number) {
    return new Promise<boolean>((resolve, reject) => {
        const params = {'symbol': symbol, 'side': side == 'LONG' ? 'SELL' : 'BUY', 'type': 'TAKE_PROFIT_MARKET', 'timeInForce': 'GTE_GTC', 'quantity': quantity, 'stopPrice': price, 'workingType': 'MARK_PRICE', 'closePosition': true, 'timestamp': Date.now()}
        let queryString = Object.entries(params).map((key, value) => key.join('=')).join('&')
        const sign = signature(queryString)
        const config = {
            headers: {
                'X-MBX-APIKEY': process.env.REACT_APP_BINANCE_KEY
            },
            params: {
                ...params,
                'signature': sign
            }
        }

        axios.post(`http://localhost:8080/${process.env.REACT_APP_BASE_URL}${Constants.ENDPOINT_NEW_ORDER}`, null, config).then((response) => {
            if (response.status >= 200 && response.status < 300 && response.data) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}

export function openLimitStopLossOrder(symbol: string, side: string, quantity: number, price: number) {
    return new Promise<boolean>((resolve, reject) => {
        const timestamp = Date.now()
        const params = {'timestamp': timestamp}
        let queryString = Object.entries(params).map((key, value) => key.join('=')).join('&')
        const sign = signature(queryString)
        const config = {
            headers: {
                'X-MBX-APIKEY': process.env.REACT_APP_BINANCE_KEY
            },
            params: {
                'timestamp': timestamp,
                'signature': sign
            }
        }
        axios.post(`${process.env.REACT_APP_BASE_URL}${Constants.ENDPOINT_NEW_ORDER}`, {
            symbol: symbol,
            side: side,
            positionSide: "BOTH",
            type: "STOP",
            timeInForce: "GTC",
            quantity: quantity,
            stopPrice: price,
            price: price,
            reduceOnly: true,
            timestamp: Date.now()
        }).then((response) => {
            if (response.status >= 200 && response.status < 300 && response.data) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}

export function openLimitTakeProfitOrder(symbol: string, side: string, quantity: number, price: number) {
    return new Promise<boolean>((resolve, reject) => {
        axios.post(`${process.env.REACT_APP_BASE_URL}${Constants.ENDPOINT_NEW_ORDER}`, {
            symbol: symbol,
            side: side,
            positionSide: "BOTH",
            type: "TAKE_PROFIT",
            timeInForce: "GTC",
            quantity: quantity,
            stopPrice: price,
            price: price,
            reduceOnly: true,
            timestamp: Date.now()
        }).then((response) => {
            if (response.status >= 200 && response.status < 300 && response.data) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}