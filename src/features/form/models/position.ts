import { JsonObject, JsonProperty } from "json2typescript"

@JsonObject("Position")
export class Position {
    @JsonProperty("leverage", String)
    leverage: string
    @JsonProperty("symbol", String)
    symbol: string
    @JsonProperty("unRealizedProfit", String)
    unRealizedProfit: string
    @JsonProperty("entryPrice", String)
    entryPrice: string
    @JsonProperty("positionAmt", String)
    positionAmt: string

    constructor() {
        this.leverage = ""
        this.symbol = ""
        this.unRealizedProfit = ""
        this.entryPrice = ""
        this.positionAmt = ""
    }
}