import { Alert, Card, Grid, Typography } from "@mui/material";
import { useAppSelector } from "../../app/hooks"
import { PositionComponent } from "./components/PositionComponent";
import { selectPositions, selectTotalBalance } from "./formSlice";
import { Position } from "./models/position";

export function PositionsForm() {
    const positions = useAppSelector(selectPositions)
    const totalBalance = useAppSelector(selectTotalBalance)

    return (
        <Grid item container spacing={1.5}>
            {positions.length == 0 ? <Grid item xs={12}>
                <Alert severity="info">No positions opened.</Alert>
            </Grid> : positions.map((value) => {
                return <PositionComponent position={value} totalBalance={totalBalance} />
            })}
        </Grid>
    )
}