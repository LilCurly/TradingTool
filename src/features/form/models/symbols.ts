import { JsonObject, JsonProperty } from "json2typescript"

@JsonObject("Symbol")
export class Symbol {
    @JsonProperty("symbol", String)
    symbol: string
    @JsonProperty("status", String)
    status: string
    @JsonProperty("quantityPrecision", Number)
    quantityPrecision: number
    @JsonProperty("pricePrecision", Number)
    pricePrecision: number

    constructor() {
        this.status = ""
        this.symbol = ""
        this.quantityPrecision = 0
        this.pricePrecision = 0
    }
}

@JsonObject("Symbols")
export class Symbols {
    @JsonProperty("symbols", [Symbol])
    symbols: Symbol[]

    constructor() {
        this.symbols = []
    }
}