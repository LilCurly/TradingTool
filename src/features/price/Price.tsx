import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets"
import { useAppSelector } from "../../app/hooks"
import { selectSelectedSymbol, selectShowChart } from "../form/formSlice"
import styles from './Price.module.css'

export function Price() {
    const selectedSymbol = useAppSelector(selectSelectedSymbol)
    const showChart = useAppSelector(selectShowChart)

    return (
        <div className={styles.Container}>
            {showChart && <AdvancedRealTimeChart theme="dark" symbol={selectedSymbol?.symbol.concat("PERP")} interval="60" autosize></AdvancedRealTimeChart>}
        </div>
    )
}
