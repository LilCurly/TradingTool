import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("Balance")
export class Balance {
    @JsonProperty("asset", String)
    asset: string
    @JsonProperty("availableBalance", String)
    availableBalance: string
    @JsonProperty("balance", String)
    balance: string

    constructor() {
        this.asset = ""
        this.availableBalance = ""
        this.balance = ""
    }
}