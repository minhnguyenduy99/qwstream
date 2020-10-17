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
    { page = 1, aggregates = [], placeholders = {} }: LimitOptions): 
    Promise<ResultLimiterOuptput<T>> {
    
    const offset = (page - 1) * this.limitOptions.limit;

    const aggregate = model.aggregate(aggregates);
    const [results, remainItemsCount] = await Promise.all([
      aggregate.skip(offset).limit(this.limitOptions.limit).exec(),
      this.countRemainItems(model, offset)
    ]);

    const limitResult = this.constructLimitInfor(placeholders, results, remainItemsCount, page);
    
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

  protected constructLimitInfor(placeholders: any, results: any[], remainItemCount: number, page = 1): ResultLimiterOuptput<any> {
    return {
      next: remainItemCount === 0 ? null : this.constructNextQueryURL(placeholders, page),
      remain_item_count: remainItemCount,
      results: results
    }
  }

  protected constructNextQueryURL(placeholders, page = 1) {
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
} 