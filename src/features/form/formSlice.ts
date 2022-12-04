import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { fetchExchangeInformations, fetchAvailableAmount, updateLeverage, openLimitOrder, openMarketStopLossOrder, openMarketTakeProfitOrder, fetchCurrentSymbolPrice, openMarketOrder, setOneWayMode, setIsolatedMarginType, hasOrders, fetchPositions } from "./formApi";
import { Position } from "./models/position";
import { Symbol } from "./models/symbols";

export interface FormState {
    symbols: Symbol[],
    selectedSymbol: Symbol | undefined,
    totalBalance: number,
    availableBalance: number,
    limitPrice: number,
    slPrice: number,
    tpPrice: number,
    ratio: number,
    risk: number,
    leverage: number,
    quantity: number,
    side: 'LONG' | 'SHORT' | undefined,
    showChart: boolean,
    errorMessages: string[],
    successMessages: string[],
    shouldOpenEdgePositions: boolean,
    orderType: 'LIMIT' | 'MARKET',
    symbolHasOrders: boolean,
    currentPanel: 'TRADE' | 'POSITIONS',
    positions: Position[]
}

const initialState: FormState = {
    symbols: [],
    selectedSymbol: undefined,
    totalBalance: 0,
    availableBalance: 0,
    limitPrice: 0,
    slPrice: 0,
    tpPrice: 0,
    ratio: 1,
    risk: 1,
    leverage: 3,
    quantity: 0,
    side: undefined,
    showChart: true,
    errorMessages: [],
    successMessages: [],
    shouldOpenEdgePositions: false,
    orderType: 'LIMIT',
    symbolHasOrders: false,
    currentPanel: 'TRADE',
    positions: []
}

export const fetchExchangeInformationsAsync = createAsyncThunk(
    'form/fetchExchangeInformation',
    async (_, thunkApi) => {
        const response = await fetchExchangeInformations()
        if (response) {
            return response
        } else {
            thunkApi.rejectWithValue(undefined)
        }
    }
)

export const setOneWayModeAsync = createAsyncThunk(
    'form/setOneWayModeAsync',
    async (_, thunkApi) => {
        const response = await setOneWayMode()
        if (response) {
            return response
        } else {
            thunkApi.rejectWithValue(undefined)
        }
    }
)

export const setIsolatedMarginTypeAsync = createAsyncThunk(
    'form/setIsolatedMarginTypeAsync',
    async (_, thunkApi) => {
        const state = thunkApi.getState() as { form: FormState }
        if (state.form.selectedSymbol != undefined) {
            const response = await setIsolatedMarginType(state.form.selectedSymbol.symbol)
            if (response) {
                return response
            } else {
                thunkApi.rejectWithValue(undefined)
            }
        } else {
            thunkApi.rejectWithValue(undefined)
        }
    }
)

export const hasOrdersAsync = createAsyncThunk(
    'form/hasOrdersAsync',
    async (_, thunkApi) => {
        const state = thunkApi.getState() as { form: FormState }
        if (state.form.selectedSymbol != undefined) {
            const response = await hasOrders(state.form.selectedSymbol.symbol)
            if (response) {
                return response
            } else {
                thunkApi.rejectWithValue(undefined)
            }
        } else {
            thunkApi.rejectWithValue(undefined)
        }
    }
)

export const fetchCurrentSymbolPriceAsync = createAsyncThunk(
    'form/fetchCurrentSymbolPriceAsync',
    async (_, thunkApi) => {
        const state = thunkApi.getState() as { form: FormState }
        if (state.form.selectedSymbol != undefined) {
            const response = await fetchCurrentSymbolPrice(state.form.selectedSymbol.symbol)
            if (response) {
                return response
            } else {
                thunkApi.rejectWithValue(undefined)
            }
        } else {
            thunkApi.rejectWithValue(undefined)
        }
    }
)

export const fetchAvailableAmountAsync = createAsyncThunk(
    'form/fetchAvailableAmount',
    async (_, thunkApi) => {
        const response = await fetchAvailableAmount()
        if (response) {
            return response
        } else {
            thunkApi.rejectWithValue(undefined)
        }
    }
)

export const fetchPositionsAsync = createAsyncThunk(
    'form/fetchPositionsAsync',
    async (_, thunkApi) => {
        const response = await fetchPositions()
        if (response) {
            return response
        } else {
            thunkApi.rejectWithValue(undefined)
        }
    }
)

export const updateLeverageAsync = createAsyncThunk(
    'form/updateLeverage',
    async ({symbol, leverage}: {symbol: string, leverage: number}, thunkApi) => {
        const response = await updateLeverage(symbol, leverage)
        if (response) {
            return leverage
        } else {
            thunkApi.rejectWithValue(undefined)
        }
    }
)

export const openOrderAsync = createAsyncThunk(
    'form/openOrderAsync',
    async (_, thunkApi) => {
        const state = thunkApi.getState() as { form: FormState }
        if (state.form.selectedSymbol != undefined && state.form.slPrice > 0 && state.form.tpPrice > 0 && state.form.side != undefined  && state.form.quantity > 0) {
            if (state.form.orderType == 'LIMIT' && state.form.limitPrice > 0) {
                const response = await openLimitOrder(state.form.selectedSymbol.symbol, state.form.side, state.form.quantity, parseFloat(state.form.limitPrice.toFixed(state.form.selectedSymbol.pricePrecision)))
                if (response) {
                    return response
                } else {
                    thunkApi.rejectWithValue(undefined)
                }
            } else if (state.form.orderType == 'MARKET') {
                const response = await openMarketOrder(state.form.selectedSymbol.symbol, state.form.side, state.form.quantity)
                if (response) {
                    return response
                } else {
                    thunkApi.rejectWithValue(undefined)
                }
            } else {
                thunkApi.rejectWithValue(undefined)
            }
        } else {
            thunkApi.rejectWithValue(undefined)
        }
    }
)

export const openMarketStopLossAsync = createAsyncThunk(
    'form/openMarketStopLossAsync',
    async (_, thunkApi) => {
        const state = thunkApi.getState() as { form: FormState }
        if (state.form.selectedSymbol != undefined && state.form.limitPrice > 0 && state.form.slPrice > 0 && state.form.tpPrice > 0 && state.form.side != undefined  && state.form.quantity > 0) {
            const response = await openMarketStopLossOrder(state.form.selectedSymbol.symbol, state.form.side, state.form.quantity, parseFloat(state.form.slPrice.toFixed(state.form.selectedSymbol.pricePrecision)))
            if (response) {
                return response
            } else {
                thunkApi.rejectWithValue(undefined)
            }
        } else {
            thunkApi.rejectWithValue(undefined)
        }
    }
)

export const openMarketTakeProfitAsync = createAsyncThunk(
    'form/openMarketTakeProfitAsync',
    async (_, thunkApi) => {
        const state = thunkApi.getState() as { form: FormState }
        if (state.form.selectedSymbol != undefined && state.form.limitPrice > 0 && state.form.slPrice > 0 && state.form.tpPrice > 0 && state.form.side != undefined  && state.form.quantity > 0) {
            const response = await openMarketTakeProfitOrder(state.form.selectedSymbol.symbol, state.form.side, state.form.quantity, parseFloat(state.form.tpPrice.toFixed(state.form.selectedSymbol.pricePrecision)))
            if (response) {
                return response
            } else {
                thunkApi.rejectWithValue(undefined)
            }
        } else {
            thunkApi.rejectWithValue(undefined)
        }
    }
)

export const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        selectSymbol: (state, action: PayloadAction<string>) => {
            state.selectedSymbol = state.symbols.find((symbol) => {
                return symbol.symbol == action.payload
            })
            console.log(action.payload)
            state.limitPrice = 0
            state.slPrice = 0
            state.tpPrice = 0
            state.ratio = 1
        },
        updateLimitPrice: (state, action: PayloadAction<number>) => {
            if (!isNaN(action.payload)) {
                state.limitPrice = action.payload
            } else {
                state.limitPrice = 0
            }

            if (state.limitPrice > 0 && state.slPrice > 0 && state.tpPrice > 0) {
                state.side = determinateSide(state.limitPrice, state.slPrice, state.tpPrice)
            }
            if (state.slPrice > 0 && state.tpPrice > 0 && state.side != undefined) {
                state.ratio = calculateRatio(state.side, action.payload, state.slPrice, state.tpPrice)
            }
            if (state.totalBalance > 0 && state.limitPrice > 0 && state.slPrice > 0) {
                state.quantity = calculateQuantity(state.limitPrice, state.slPrice, state.risk, state.totalBalance, state.selectedSymbol != undefined ? state.selectedSymbol.quantityPrecision : 2)
            }
        },
        updateRatio: (state, action: PayloadAction<number>) => {
            state.ratio = action.payload
            if (state.limitPrice > 0 && state.slPrice > 0) {
                state.tpPrice = calculateTakeProfitPrice(state.limitPrice, state.slPrice, action.payload, state.selectedSymbol != undefined ? state.selectedSymbol.pricePrecision : 2)
                if (state.tpPrice > 0) {
                    state.side = determinateSide(state.limitPrice, state.slPrice, state.tpPrice)
                }
            }
        },
        updateTakeProfitPrice: (state, action: PayloadAction<number>) => {
            if (!isNaN(action.payload)) {
                state.tpPrice = action.payload
            } else {
                state.tpPrice = 0
            }

            if (state.limitPrice > 0 && state.slPrice > 0 && state.tpPrice > 0) {
                state.side = determinateSide(state.limitPrice, state.slPrice, state.tpPrice)
            }
            if (state.limitPrice > 0 && state.slPrice > 0 && state.side != undefined) {
                state.ratio = calculateRatio(state.side, state.limitPrice, state.slPrice, action.payload)
            }
        },
        updateStopLossPrice: (state, action: PayloadAction<number>) => {
            if (!isNaN(action.payload)) {
                state.slPrice = action.payload
            } else {
                state.slPrice = 0
            }
            
            if (state.limitPrice > 0 && state.slPrice > 0 && state.tpPrice > 0) {
                state.side = determinateSide(state.limitPrice, state.slPrice, state.tpPrice)
            }
            if (state.limitPrice > 0 && state.tpPrice > 0 && state.side != undefined) {
                state.ratio = calculateRatio(state.side, state.limitPrice, action.payload, state.tpPrice)
            }
            if (state.totalBalance > 0 && state.limitPrice > 0 && state.slPrice > 0) {
                state.quantity = calculateQuantity(state.limitPrice, state.slPrice, state.risk, state.totalBalance, state.selectedSymbol != undefined ? state.selectedSymbol.quantityPrecision : 2)
            }
        },
        updateRisk: (state, action: PayloadAction<number>) => {
            state.risk = action.payload
            if (state.limitPrice > 0 && state.totalBalance > 0 && state.slPrice > 0) {
                state.quantity = calculateQuantity(state.limitPrice, state.slPrice, state.risk, state.totalBalance, state.selectedSymbol != undefined ? state.selectedSymbol?.quantityPrecision : 2)
            }
        },
        updateShowChart: (state, action: PayloadAction<boolean>) => {
            state.showChart = action.payload
        },
        clearMessages: (state) => {
            state.errorMessages = []
            state.successMessages = []
        },
        updateOrderType: (state, action: PayloadAction<'LIMIT' | 'MARKET'>) => {
            state.orderType = action.payload
        },
        updateCurrentPanel: (state, action: PayloadAction<'TRADE' | 'POSITIONS'>) => {
            state.currentPanel = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchExchangeInformationsAsync.fulfilled, (state, action) => {
            if (action.payload != undefined && action.payload.symbols.length > 0) {
                state.symbols = action.payload.symbols.filter((el, index, arr) => {
                    return el.status == 'TRADING' && el.symbol.endsWith("USDT")
                })
            } else {
                state.errorMessages.push("Could not fetch symbols") 
            }
        })
        .addCase(fetchExchangeInformationsAsync.rejected, (state, action) => {
            state.errorMessages.push("Could not fetch symbols") 
        })
        .addCase(fetchAvailableAmountAsync.fulfilled, (state, action) => {
            if (action.payload != undefined) {
                state.totalBalance = parseFloat(parseFloat(action.payload.balance).toFixed(2))
                state.availableBalance = parseFloat(parseFloat(action.payload.availableBalance).toFixed(2))
            } else {
                state.errorMessages.push("Could not fetch balances") 
            }
        })
        .addCase(fetchAvailableAmountAsync.rejected, (state, action) => {
            state.errorMessages.push("Could not fetch balances") 
        })
        .addCase(updateLeverageAsync.fulfilled, (state, action) => {
            if (action.payload != undefined && action.payload > 0) {
                state.leverage = action.payload
            } else {
                state.errorMessages.push("Could not update leverage") 
            }
        })
        .addCase(updateLeverageAsync.rejected, (state, action) => {
            state.errorMessages.push("Could not update leverage") 
        })
        .addCase(openOrderAsync.fulfilled, (state, action) => {
            state.successMessages.push("Successfully opened a position") 
            state.shouldOpenEdgePositions = true
            state.symbolHasOrders = true
        })
        .addCase(openOrderAsync.rejected, (state, action) => {
            state.errorMessages.push("Failed to open a position") 
        })
        .addCase(openMarketStopLossAsync.fulfilled, (state, action) => {
            state.successMessages.push("Successfully opened stop loss position") 
            state.shouldOpenEdgePositions = false
            state.limitPrice = 0
            state.slPrice = 0
            state.tpPrice = 0
        })
        .addCase(openMarketStopLossAsync.rejected, (state, action) => {
            state.errorMessages.push("Failed to open stop loss position") 
            state.shouldOpenEdgePositions = false
        })
        .addCase(openMarketTakeProfitAsync.fulfilled, (state, action) => {
            state.successMessages.push("Successfully opened take profit position") 
            state.shouldOpenEdgePositions = false
            state.limitPrice = 0
            state.slPrice = 0
            state.tpPrice = 0
        })
        .addCase(openMarketTakeProfitAsync.rejected, (state, action) => {
            state.errorMessages.push("Failed to open take profit position") 
            state.shouldOpenEdgePositions = false
        })
        .addCase(fetchCurrentSymbolPriceAsync.fulfilled, (state, action) => {
            if (action.payload != undefined) {
                state.limitPrice = parseFloat(action.payload.price)
            } else {
                state.errorMessages.push("Failed to fetch latest price")
            }
        })
        .addCase(fetchCurrentSymbolPriceAsync.rejected, (state, action) => {
            state.errorMessages.push("Failed to fetch latest price")
        })
        .addCase(hasOrdersAsync.fulfilled, (state, action) => {
            if (action.payload != undefined) {
                state.symbolHasOrders = action.payload || state.positions.find((value, i, arr) => {
                return value.symbol == state.selectedSymbol?.symbol
            }) != undefined
            } else {
                state.symbolHasOrders = false
            }
        })
        .addCase(hasOrdersAsync.rejected, (state, action) => {
            state.symbolHasOrders = false
        })
        .addCase(fetchPositionsAsync.fulfilled, (state, action) => {
            if (action.payload != undefined) {
                state.positions = action.payload.filter((value, i, arr) => {
                    return parseFloat(value.entryPrice) > 0 && (parseFloat(value.positionAmt) > 0 || parseFloat(value.positionAmt) < 0)
                })
            }
        })
    }
})

function determinateSide(limitPrice: number, slPrice: number, tpPrice: number): 'LONG' | 'SHORT' | undefined {
    if (limitPrice > slPrice && limitPrice < tpPrice) {
        return 'LONG'
    } else if (limitPrice < slPrice && limitPrice > tpPrice) {
        return 'SHORT'
    }
    return undefined
}

function calculateRatio(side: string, limitPrice: number, slPrice: number, tpPrice: number): number {
    if (limitPrice == 0 || slPrice == 0 || tpPrice == 0) {
        return 1
    }
    let slBound = side == 'LONG' ? limitPrice - slPrice : slPrice - limitPrice
    let tpBound = side == 'LONG' ? tpPrice - limitPrice : limitPrice - tpPrice
    return Math.floor(tpBound/slBound)
}

function calculateTakeProfitPrice(limitPrice: number, slPrice: number, ratio: number, pricePrecision: number): number {
    if (limitPrice == 0 || slPrice == 0) {
        return 0
    }
    let slDiff = limitPrice - slPrice
    let ratioPrice = slDiff * ratio
    return parseFloat((limitPrice + ratioPrice).toFixed(pricePrecision))
}

function calculateStopLossPrice(side: string, limitPrice: number, tpPrice: number, ratio: number): number {
    if (limitPrice == 0 || tpPrice == 0) {
        return 0
    }
    let tpDiff = side == 'LONG' ? tpPrice - limitPrice : limitPrice - tpPrice
    let ratioPrice = tpDiff / ratio
    return side == 'LONG' ? limitPrice - ratioPrice : limitPrice + ratioPrice
}

function calculateQuantity(limitPrice: number, slPrice: number, risk: number, availableAmount: number, quantityPrecision: number): number {
    let readyToLooseAmount = availableAmount * (risk / 100)
    let slDiff = Math.abs(limitPrice - slPrice)
    let quantity = readyToLooseAmount / slDiff
    return parseFloat(quantity.toFixed(quantityPrecision))
}

export const { selectSymbol, updateLimitPrice, updateStopLossPrice, updateTakeProfitPrice, updateRisk, updateRatio, updateShowChart, clearMessages, updateOrderType, updateCurrentPanel } = formSlice.actions

export const selectSymbols = (state: RootState) => state.form.symbols
export const selectSelectedSymbol = (state: RootState) => state.form.selectedSymbol
export const selectCanSubmitShort = (state: RootState) => {
    return state.form.totalBalance > 0 && state.form.availableBalance > 0 && state.form.limitPrice > 0 && state.form.slPrice > 0 && state.form.tpPrice > 0 && state.form.quantity > 0 && state.form.ratio >= 1 && (state.form.quantity * state.form.limitPrice) / state.form.leverage < state.form.availableBalance && state.form.side == 'SHORT'
}
export const selectCanSubmitLong = (state: RootState) => {
    return state.form.totalBalance > 0 && state.form.availableBalance > 0 && state.form.limitPrice > 0 && state.form.slPrice > 0 && state.form.tpPrice > 0 && state.form.quantity > 0 && state.form.ratio >= 1 && (state.form.quantity * state.form.limitPrice) / state.form.leverage < state.form.availableBalance && state.form.side == 'LONG'
}
export const selectTotalBalance = (state: RootState) => state.form.totalBalance
export const selectAvailableBalance = (state: RootState) => state.form.availableBalance
export const selectLimitPrice = (state: RootState) => state.form.limitPrice
export const selectStopLossPrice = (state: RootState) => state.form.slPrice
export const selectTakeProfitPrice = (state: RootState) => state.form.tpPrice
export const selectRisk = (state: RootState) => state.form.risk
export const selectRatio = (state: RootState) => state.form.ratio
export const selectLeverage = (state: RootState) => state.form.leverage
export const selectSide = (state: RootState) => state.form.side
export const selectQuantity = (state: RootState) => state.form.quantity
export const selectPotentialGains = (state: RootState) => {
    if (state.form.limitPrice > 0 && state.form.quantity > 0 && state.form.tpPrice > 0) {
        if (state.form.side == 'LONG') {
            return ((state.form.tpPrice - state.form.limitPrice) * state.form.quantity).toFixed(2)
        } else if (state.form.side == 'SHORT') {
            return ((state.form.limitPrice - state.form.tpPrice) * state.form.quantity).toFixed(2)
        }
    } else {
        return "0"
    }
    return "0"
}
export const selectPotentialLoss = (state: RootState) => {
    console.log(`limitPrice: ${state.form.limitPrice} Qty: ${state.form.quantity} slPrice: ${state.form.slPrice} side: ${state.form.side}`)
    if (state.form.limitPrice > 0 && state.form.quantity > 0 && state.form.slPrice > 0) {
        if (state.form.side == 'LONG') {
            return ((state.form.limitPrice - state.form.slPrice) * state.form.quantity).toFixed(2)
        } else if (state.form.side == 'SHORT') {
            return ((state.form.slPrice - state.form.limitPrice) * state.form.quantity).toFixed(2)
        }
    } else {
        return "0"
    }
    return "0"
}
export const selectAmountUsage = (state: RootState) => {
    if (state.form.limitPrice > 0 && state.form.quantity > 0 && state.form.leverage > 0) {
        return parseFloat(((state.form.limitPrice * state.form.quantity) / state.form.leverage).toFixed(2))
    } else {
        return "0"
    }
}
export const selectFormDisabled = (state: RootState) => {
    return state.form.selectedSymbol == undefined || state.form.totalBalance <= 0 || state.form.symbolHasOrders
}
export const selectShowChart = (state: RootState) => {
    return state.form.showChart
}
export const selectErrorMessages = (state: RootState) => {
    return state.form.errorMessages
}
export const selectSuccessMessages = (state: RootState) => {
    return state.form.successMessages
}
export const selectShouldOpenEdgePositions = (state: RootState) => state.form.shouldOpenEdgePositions
export const selectOrderType = (state: RootState) => state.form.orderType
export const selectSymbolHasOrders = (state: RootState) => state.form.symbolHasOrders
export const selectCurrentPanel = (state: RootState) => state.form.currentPanel
export const selectPositions = (state: RootState) => state.form.positions

export default formSlice.reducer