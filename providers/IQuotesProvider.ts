import * as Models from "./models/";

export interface IQuotesProvider {
    getRandomQuote(): Promise<Models.IQuote>;
}
