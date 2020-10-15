import { Document, Model } from "mongoose";


export interface IPaginator {
  /**
   * Paginate the results queried from model
   * @param model The model to be applied with pagination
   * @param options Options for pagination result
   */
  paginate<T extends Document>(model: Model<T>, options: PaginateOptions): 
    Promise<PaginationResult<T>> | PaginationResult<T>;
}

export interface PaginateOptions {
  /**
   * The page value to retrieve result. Default to `1`
   */
  page?: number;

  /**
   * The array of aggregations applied to the query.
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
    [key: string]: string
  }
}

export interface PaginationConstruct {
  pageURL: string;
  pageSize?: number;
  pageQueryParam?: string;
}

export interface PaginationResult<T> {
  page: number;
  next: string;
  previous: string;
  count: number;
  page_count: number;
  results: T[];
}