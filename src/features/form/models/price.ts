import { JsonObject, JsonProperty } from "json2typescript"

@JsonObject("Price")
export class Price {
    @JsonProperty("symbol", String)
    symbol: string
    @JsonProperty("price", String)
    price: string

    constructor() {
        this.symbol = ""
        this.price = ""
    }
}