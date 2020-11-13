import { Document, Model } from "mongoose";
import { IResultLimiter, LimitOptions, ResultLimiterConstruct, ResultLimiterOuptput } from "./result-limiter.interfaces";


export default class ResultLimiter implements IResultLimiter {

  protected limitOptions: ResultLimiterConstruct;

  constructor({ requestURL, limitQueryParam = "page", limit = 10 }: ResultLimiterConstruct) {
    this.limitOptions = {
      requestURL, limitQueryParam, limit
    }
  }

  async query<T extends Document>(
    model: Model<T>,
    { page = 1, aggregates = [], placeholders = {}, additionQuery = null }: LimitOptions): 
    Promise<ResultLimiterOuptput<T>> {
    
    const offset = (page - 1) * this.limitOptions.limit;
    const nextOffset = offset + this.limitOptions.limit;

    const aggregate = model.aggregate(aggregates);
    const [results, remainItemsCount] = await Promise.all([
      aggregate.skip(offset).limit(this.limitOptions.limit).exec(),
      this.countRemainItems(model, nextOffset, aggregates)
    ]);

    const limitResult = this.constructLimitInfor(placeholders, results, remainItemsCount, page, additionQuery);
    
    return limitResult as ResultLimiterOuptput<T>;
  }

  protected async countRemainItems(model: Model<any>, offset = 0, aggregates = []): Promise<number> {
    const aggregate = model.aggregate([
      ...aggregates,
      {
        $skip: offset
      },
      {
        $count: "count"
      }
    ]);
    const result = await aggregate.exec();

    return result.length === 0 ? 0 : result[0]["count"];
  }

  protected constructLimitInfor(placeholders: any, results: any[], remainItemCount: number, page = 1, query = null): ResultLimiterOuptput<any> {
    let next = this.constructNextQueryURL(placeholders, page);
    if (query) {
      next = this.constructAdditionalQueryParameters(next, query);
    }
    return {
      next: remainItemCount === 0 ? null : next,
      remain_item_count: remainItemCount,
      results: results
    }
  }

  protected constructNextQueryURL(placeholders, page = 1): string {
    let { requestURL: parsedQueryURL } = this.limitOptions;
    const { limitQueryParam } = this.limitOptions;
    Object.keys(placeholders).forEach((key => {
      if (!placeholders[key]) {
        throw Error("Dynamic route is invalid");
      }
      parsedQueryURL = parsedQueryURL.replace(`{${key}}`, placeholders[key]);
    }));
    return `${parsedQueryURL}?${limitQueryParam}=${page + 1}`;
  }

  protected constructAdditionalQueryParameters(currentURL: string, queryObj: any) {
    let resultURL = currentURL;
    Object.keys(queryObj).forEach(queryName => {
      resultURL += `&${queryName}=${queryObj[queryName]}`;
    });
    return resultURL;
  }
} 