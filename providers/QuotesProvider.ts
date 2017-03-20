import { IQuotesProvider } from "./IQuotesProvider";
import * as Models from "./models/";
import * as axios from "axios";
import * as config from "config";
import { injectable } from "inversify";

@injectable()
export class QuotesProvider implements IQuotesProvider {
    public async getRandomQuote(): Promise<Models.IQuote> {
        let quotesConfig: any = config.get("quote_service");
        let quoteResponse: any = await axios.get(quotesConfig.host, { headers: { "X-Mashape-Key": quotesConfig.auth_key } });

        if (quoteResponse.status == 200) {
            return quoteResponse.data;
        }
        return null;
    }
}
