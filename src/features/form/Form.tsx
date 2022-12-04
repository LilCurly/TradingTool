import { Box, Chip, Grid, IconButton } from "@mui/material"
import RefreshIcon from "@mui/icons-material/Refresh"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { updateShowChart, fetchAvailableAmountAsync, selectAvailableBalance, selectTotalBalance, selectShowChart, selectCurrentPanel, fetchPositionsAsync, selectErrorMessages, selectSuccessMessages } from "./formSlice"
import { TradeForm } from "./TradeForm"
import { OrderTypeComponent } from "./components/OrderTypeComponent"
import { PanelChoiceComponent } from "./components/PanelChoiceComponent"
import { PositionsForm } from "./PositionsForm"
import { useSnackbar } from "notistack"
import { useEffect } from "react"


export function Form() {
    const currentPanel = useAppSelector(selectCurrentPanel)
    const totalBalance = useAppSelector(selectTotalBalance)
    const availableBalance = useAppSelector(selectAvailableBalance)
    const showChart = useAppSelector(selectShowChart)
    const errorMessages = useAppSelector(selectErrorMessages)
    const successMessages = useAppSelector(selectSuccessMessages)
    const dispatch = useAppDispatch()

    const snackbar = useSnackbar()

    useEffect(() => {
        if (errorMessages.length > 0) {
            snackbar.enqueueSnackbar(errorMessages[errorMessages.length - 1], { variant: 'error' })
        }
    }, [errorMessages])

    useEffect(() => {
        if (successMessages.length > 0) {
            snackbar.enqueueSnackbar(successMessages[successMessages.length - 1], { variant: 'success' })
        }
    }, [successMessages])

    var interval: NodeJS.Timer | undefined = undefined

    useEffect(() => {
        dispatch(fetchAvailableAmountAsync())
        dispatch(fetchPositionsAsync())
        if (interval == undefined) {
            interval = setInterval(() => {
                dispatch(fetchAvailableAmountAsync())
                dispatch(fetchPositionsAsync())
            }, 180000)
        }

        return () => {
            if (interval != undefined) {
                clearInterval(interval)
            }
        }
    }, [])

    return (
        <div style={{padding: "35px"}}>
            <Box sx={{flexGrow: 1}}>
                <Grid container spacing={{ xs: 2, sm: 3.5 }}>
                    <PanelChoiceComponent />
                    <Grid item container spacing={1}>
                        <Grid item >
                            <Chip label={`Total: ${totalBalance}`} variant="outlined" />
                        </Grid>
                        <Grid item >
                            <Chip label={`Available: ${availableBalance}`} variant="outlined" />
                        </Grid>
                        <Grid item>
                            <IconButton color="primary" aria-label="upload picture" component="label" onClick={() => {
                                dispatch(fetchAvailableAmountAsync())
                                dispatch(fetchPositionsAsync())
                            }}>
                                <RefreshIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton color="primary" aria-label="upload picture" component="label" onClick={() => {
                                dispatch(updateShowChart(!showChart))
                            }}>
                                {showChart ? <Visibility />: <VisibilityOff />}
                            </IconButton>
                        </Grid>
                        {currentPanel == 'TRADE' &&
                            <OrderTypeComponent />
                        }
                    </Grid>
                    {currentPanel == 'TRADE' ? <TradeForm /> : <PositionsForm />}
                </Grid>
            </Box>
        </div>
    )
}