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
    { limit = this.limitOptions.limit, offset = 0, aggregates = [], placeholders = {} }: LimitOptions): 
    Promise<ResultLimiterOuptput<T>> {

    const aggregate = model.aggregate(aggregates);
    const [results, remainItemsCount] = await Promise.all([
      aggregate.skip(offset).limit(limit).exec(),
      this.countRemainItems(model, offset)
    ]);

    const limitResult = this.constructLimitInfor(placeholders, results, remainItemsCount);
    
    return limitResult as ResultLimiterOuptput<T>;
  }

  protected async countRemainItems(model: Model<any>, offset = 0): Promise<number> {
    const aggregate = model.aggregate([
      {
        $count: "count"
      }
    ]);
    const result = await aggregate
    .skip(offset)
    .exec();

    return result.length === 0 ? 0 : result[0]["count"];
  }

  protected constructLimitInfor(placeholders: any, results: any[], remainItemCount: number): ResultLimiterOuptput<any> {
    return {
      next: this.constructQueryURL(placeholders),
      remain_item_count: remainItemCount,
      results: results
    }
  }

  protected constructQueryURL(placeholders) {
    let { requestURL: parsedQueryURL } = this.limitOptions;
    const { limit, limitQueryParam } = this.limitOptions;
    Object.keys(placeholders).forEach((key => {
      if (!placeholders[key]) {
        throw Error("Dynamic route is invalid");
      }
      parsedQueryURL = parsedQueryURL.replace(`{${key}}`, placeholders[key]);
    }));
    return `${parsedQueryURL}?${limitQueryParam}=${limit}`;
  }
} 