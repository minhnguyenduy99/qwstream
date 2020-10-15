import { Document, Model } from "mongoose";


export interface IResultLimiter {
  /**
   * Apply limit to the queried results
   * @param model The model to apply the query
   * @param options Options for the limit query
   */
  query<T extends Document>(model: Model<T>, options: LimitOptions)
  : Promise<ResultLimiterOuptput<T>> | ResultLimiterOuptput<T>;
}

export interface LimitOptions {
  limit?: number;
  /**
   * The offset from which the query starts. Default is `0`
   */
  offset?: number;

  /**
   * The list of aggregations applied to the query
   */
  aggregates?: any[];


  /**
   * An object of placeholder in the `url` of pagination if the url contains params
   * 
   * `Example`:
   * 
   * url = `http://localhost:3000/:user_id/profiles`
   * 
   * You need to pass `user123` value to to `user_id`
   * 
   * The `user_id` param is dynamic so we can use the `placeholders` as below:
   * 
   * placeholders: {
   * 
   * `"user_id"`: "user123"
   * 
   * }
  */
  placeholders?: {
    [key: string]: string;
  }
}

export interface ResultLimiterConstruct {
  /**
   * The URL used for limiter
   */
  requestURL: string;

  /**
   * The query param used in the url. Default is `page`
   * 
   * Example: If the `limitQueryParam` is `page`, the `url` result will be:
   * 
   * `<url>?page=<page_value>`
   */
  limitQueryParam?: string;
  limit?: number;
}

export interface ResultLimiterOuptput<T extends Document> {
  /**
   * The url used for the next results.
   */
  next: string;

  /**
   * The number of results remain.
   */
  remain_item_count: number;

  /**
   * Array of results
   */
  results: T[];
}