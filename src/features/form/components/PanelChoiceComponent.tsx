import { Grid, Tab, Tabs } from "@mui/material"
import { useAppSelector, useAppDispatch } from "../../../app/hooks"
import { selectCurrentPanel, updateCurrentPanel } from "../formSlice"

export function PanelChoiceComponent() {
    const currentPanel = useAppSelector(selectCurrentPanel)
    const dispatch = useAppDispatch()

    return (
        <Grid item xs={12}>
            <Tabs value={currentPanel} style={{width: "100%"}} onChange={(_, newValue) => {
                dispatch(updateCurrentPanel(newValue))
            }}>
                <Tab label="Trade" value="TRADE"/>
                <Tab label="Positions" value="POSITIONS"/>
            </Tabs>
        </Grid>
    )
}