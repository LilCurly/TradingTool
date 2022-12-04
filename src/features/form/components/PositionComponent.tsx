import { Card, Chip, Grid, Typography } from "@mui/material";
import { Position } from "../models/position";

function calculatePercent(totalBalance: number, unRealizedProfit: number): string {
    console.log(`${totalBalance} ${unRealizedProfit}`)
    return (100 / (totalBalance / unRealizedProfit)).toFixed(2)
}

export function PositionComponent({ position, totalBalance }: { position: Position, totalBalance: number }) {
    return (
        <Grid item xs={12}>
            <Card variant="outlined" style={{padding: "12px"}}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item>
                        <Typography variant="subtitle2">{position.symbol}</Typography>
                    </Grid>
                    <Grid item>
                        <Chip label={parseFloat(position.positionAmt) > 0 ? "Long" : "Short"} color={parseFloat(position.positionAmt) > 0 ? "success" : "error"}/>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2" color="yellow">x{position.leverage}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2" color={position.unRealizedProfit.startsWith('-') ? "red" : "green"}>{parseFloat(position.unRealizedProfit).toFixed(2)} USDT</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2" color={position.unRealizedProfit.startsWith('-') ? "red" : "green"}>{calculatePercent(totalBalance, parseFloat(position.unRealizedProfit))}%</Typography>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}