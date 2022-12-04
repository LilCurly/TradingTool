import { Alert, Autocomplete, Button, Grid, IconButton, InputAdornment, MenuItem, Select, Slider, TextField, Typography } from "@mui/material"
import Adjust from "@mui/icons-material/Adjust"
import { InputAttributes, NumericFormat } from 'react-number-format';
import React, { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { openOrderAsync, fetchAvailableAmountAsync, fetchExchangeInformationsAsync, selectAmountUsage, selectCanSubmitLong, selectCanSubmitShort, selectFormDisabled, selectLeverage, selectLimitPrice, selectPotentialGains, selectPotentialLoss, selectQuantity, selectRatio, selectRisk, selectSelectedSymbol, selectStopLossPrice, selectSymbol, selectSymbols, selectTakeProfitPrice, updateLeverageAsync, updateLimitPrice, updateRatio, updateRisk, updateStopLossPrice, updateTakeProfitPrice, selectShouldOpenEdgePositions, openMarketStopLossAsync, openMarketTakeProfitAsync, fetchCurrentSymbolPriceAsync, setOneWayModeAsync, setIsolatedMarginTypeAsync, hasOrdersAsync, selectSymbolHasOrders, fetchPositionsAsync } from "./formSlice"

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const NumberFormatCustom = React.forwardRef<typeof NumericFormat<InputAttributes>, CustomProps>(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;
    return (<NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
        onChange({
            target: {
                name: props.name,
                value: values.value,
            },
        });
        }}
        thousandSeparator
        valueIsNumericString/>
    );
});

const riskMarks = [
    {
      value: 1,
      label: '1%',
    },
    {
      value: 2,
      label: '2%',
    },
    {
      value: 3,
      label: '3%',
    },
    {
      value: 4,
      label: '4%',
    },
    {
      value: 5,
      label: '5%',
    },
  ];

const ratioMarks = [
    {
      value: 1,
      label: '1/1',
    },
    {
      value: 2,
      label: '1/2',
    },
    {
      value: 3,
      label: '1/3',
    },
    {
      value: 4,
      label: '1/4',
    },
    {
      value: 5,
      label: '1/5',
    },
    {
      value: 6,
      label: '1/6',
    },
    {
      value: 7,
      label: '1/7',
    },
    {
      value: 8,
      label: '1/8',
    },
    {
      value: 9,
      label: '1/9',
    },
    {
      value: 10,
      label: '1/10',
    },
  ];

export function TradeForm() {
    const symbols = useAppSelector(selectSymbols)
    const selectedSymbol = useAppSelector(selectSelectedSymbol)
    const leverage = useAppSelector(selectLeverage)
    const limitPrice = useAppSelector(selectLimitPrice)
    const stopLossPrice = useAppSelector(selectStopLossPrice)
    const takeProfitPrice = useAppSelector(selectTakeProfitPrice)
    const risk = useAppSelector(selectRisk)
    const ratio = useAppSelector(selectRatio)
    const quantity = useAppSelector(selectQuantity)
    const canSubmitLong = useAppSelector(selectCanSubmitLong)
    const canSubmitShort = useAppSelector(selectCanSubmitShort)
    const potentialGains = useAppSelector(selectPotentialGains)
    const potentialLoss = useAppSelector(selectPotentialLoss)
    const amountUsage = useAppSelector(selectAmountUsage)
    const formDisabled = useAppSelector(selectFormDisabled)
    const shouldOpenEdgePositions = useAppSelector(selectShouldOpenEdgePositions)
    const hasOrders = useAppSelector(selectSymbolHasOrders)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (shouldOpenEdgePositions) {
            dispatch(openMarketStopLossAsync())
            dispatch(openMarketTakeProfitAsync())
            dispatch(hasOrdersAsync())
            dispatch(fetchAvailableAmountAsync())
            dispatch(fetchPositionsAsync())
        }
    }, [shouldOpenEdgePositions])

    return (
        <Grid item container spacing={3.5}>
            <Grid item xs={6} sm={8}>
                <Autocomplete defaultValue={{label: selectedSymbol != undefined ? selectedSymbol?.symbol : ""}} disablePortal loading={symbols.length == 0} onOpen={(event) => {
                        if (symbols.length == 0) {
                            dispatch(fetchExchangeInformationsAsync())
                        }
                    }} options={ symbols.map((value, index, arr) => {
                        return {
                            label: value.symbol
                        }
                    })} onChange={(event, value) => {
                        if (value?.label != undefined) {
                            dispatch(selectSymbol(value.label.toString()))
                            dispatch(updateLeverageAsync({symbol: value.label.toString(), leverage: leverage}))
                            dispatch(setOneWayModeAsync())
                            dispatch(setIsolatedMarginTypeAsync())
                            dispatch(hasOrdersAsync())
                            dispatch(fetchPositionsAsync())
                        }
                    }} renderInput={(params) => <TextField defaultValue={selectedSymbol?.symbol} color="primary" {...params} label="Symbol" />}/>
            </Grid>
            <Grid item xs={6} sm={4}>
                <Select
                    disabled={formDisabled}
                    style={{width: "100%"}}
                    value={leverage}
                    label="Leverage"
                    onChange={(event) => {
                        if (selectedSymbol != undefined) {
                            dispatch(updateLeverageAsync({symbol: selectedSymbol.symbol, leverage: event.target.value as number}))
                        }
                    }}>
                    <MenuItem value={3}>x3</MenuItem>
                    <MenuItem value={4}>x4</MenuItem>
                    <MenuItem value={5}>x5</MenuItem>
                </Select>
            </Grid>
            <Grid item xs={12}>
                <TextField disabled={formDisabled} style={{width: "100%"}} label="Limit Price" value={limitPrice >= 0 ? limitPrice.toString() : ""} onChange={(event) => {
                    dispatch(updateLimitPrice(parseFloat(event.target.value.replace(',', ''))))
                }} InputProps={{
                    inputComponent: NumberFormatCustom as any,
                    endAdornment: <InputAdornment position="end">
                        <IconButton disabled={formDisabled} edge="end" onClick={() => {dispatch(fetchCurrentSymbolPriceAsync())}}>
                            <Adjust />
                        </IconButton>
                    </InputAdornment>
                }}/>
            </Grid>
            <Grid item xs={6}>
                <TextField disabled={formDisabled} style={{width: "100%"}} label="Stop Loss" value={stopLossPrice >= 0 ? stopLossPrice.toString() : ""} onChange={(event) => {
                    dispatch(updateStopLossPrice(parseFloat(event.target.value.replace(',', ''))))
                }} InputProps={{
                    inputComponent: NumberFormatCustom as any,
                }}/>
            </Grid>
            <Grid item xs={6}>
                <TextField disabled={formDisabled} style={{width: "100%"}} label="Take Profit" value={takeProfitPrice >= 0 ? takeProfitPrice.toString() : ""} onChange={(event) => {
                    dispatch(updateTakeProfitPrice(parseFloat(event.target.value.replace(',', ''))))
                }} InputProps={{
                    inputComponent: NumberFormatCustom as any,
                }}/>
            </Grid>
            <Grid item xs={12}>
                <Typography gutterBottom style={{color: 'white'}}>Risk</Typography>
                <Slider disabled={formDisabled} value={risk} step={1} min={1} max={5} marks={riskMarks} onChange={(event, value) => {
                    dispatch(updateRisk(value as number))
                }}/>
            </Grid>
            <Grid item xs={12}>
                <Typography gutterBottom style={{color: 'white'}}>Ratio Risk/Reward (1/{ratio})</Typography>
                <Slider disabled={formDisabled} value={ratio} step={1} min={1} max={10} marks={ratioMarks} onChange={(event, value) => {
                    dispatch(updateRatio(value as number))
                }}/>
            </Grid>
            <Grid item xs={3}>
                <Typography variant="subtitle2" color="white">Order Qty:<br/>{quantity}</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography variant="subtitle2" color="white">USDT Usage:<br/>{amountUsage}</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography variant="subtitle2" color="white">Pot. Loss:<br/>{potentialLoss}</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography variant="subtitle2" color="white">Pot. Gains:<br/>{potentialGains}</Typography>
            </Grid>
            <Grid item xs={6}>
                <Button disabled={!canSubmitLong} color="success" style={{width: "100%", height: "56px"}} variant="contained" onClick={(event) => {
                    dispatch(openOrderAsync())
                }}>Open Long</Button>
            </Grid>
            <Grid item xs={6}>
                <Button disabled={!canSubmitShort} color="error" style={{width: "100%", height: "56px"}} variant="contained" onClick={(event) => {
                    dispatch(openOrderAsync())
                }}>Open Short</Button>
            </Grid>
            {hasOrders &&
            <Grid item xs={12}>
                <Alert severity="error">This pair has active orders. Close them before opening new ones.</Alert>
            </Grid>
            }
        </Grid>
    )
}