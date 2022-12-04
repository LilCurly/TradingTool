import { JsonObject, JsonProperty } from "json2typescript"

@JsonObject("Order")
export class Order {
    @JsonProperty("symbol", String)
    symbol: string

    constructor() {
        this.symbol = ""
    }
}