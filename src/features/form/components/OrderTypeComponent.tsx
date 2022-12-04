import { Grid, ToggleButton, ToggleButtonGroup } from "@mui/material"
import { useAppSelector, useAppDispatch } from "../../../app/hooks"
import { selectFormDisabled, selectOrderType, updateOrderType } from "../formSlice"

export function OrderTypeComponent() {
    const orderType = useAppSelector(selectOrderType)
    const formDisabled = useAppSelector(selectFormDisabled)
    const dispatch = useAppDispatch()

    return (
        <Grid item>
            <ToggleButtonGroup disabled={formDisabled} value={orderType} exclusive onChange={(_, newValue) => {
                dispatch(updateOrderType(newValue))
            }}>
                <ToggleButton value="LIMIT">LIM</ToggleButton>
                <ToggleButton value="MARKET">MAR</ToggleButton>
            </ToggleButtonGroup>
        </Grid>
    )
}