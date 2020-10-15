import { Injectable } from "@nestjs/common";
import { Document, Model } from "mongoose";
import { IPaginator, PaginateOptions, PaginationConstruct, PaginationResult } from "./pagination.interfaces"; 


@Injectable()
export default class Paginator implements IPaginator {
  protected pageOption: PaginationConstruct;

  constructor({ pageURL, pageQueryParam = "page", pageSize = 5 }: PaginationConstruct) {
    this.pageOption = {
      pageURL, pageQueryParam, pageSize
    }
  }

  async paginate<T extends Document>(
    model: Model<T>, 
    { page = 1, aggregates = [], placeholders = {} }: PaginateOptions) {

    if (model == null) {
      throw Error("Model cannot be null");
    }

    const queryResults = await this.query(model, page, aggregates);
    const paginationInfo = this.getPaginationInfo(page, queryResults.length, placeholders);
  
    paginationInfo.results = queryResults;
    return paginationInfo;
  }

  protected async query<T extends Document>(model: Model<T>, page: number, aggregates: any[]): Promise<any[]> {
    const aggregate = model.aggregate(aggregates);
    const { pageSize } = this.pageOption;
    const results = await aggregate
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    return results;
  }

  protected getPaginationInfo(page: number, resultCount: number, placeholders: any): PaginationResult<any> {
    const { pageSize } = this.pageOption;
    return {
      page: page,
      next: resultCount === 0 ? null : page >= pageSize ? null : this.constructPageQuery(page + 1, placeholders),
      previous: resultCount === 0 ? null : page <= 1 ? null : this.constructPageQuery(page - 1, placeholders),
      count: resultCount,
      page_count: resultCount <= 0 ? 0 : Math.ceil(resultCount / pageSize),
      results: []
    }
  }

  protected constructPageQuery(page: number, placeholders: any) {
    const { pageQueryParam, pageURL } = this.pageOption;
    const parsedURL = this.constructPathFromPlaceholders(pageURL, placeholders);
    return `${parsedURL}?${pageQueryParam}=${page}`;
  }


  protected constructPathFromPlaceholders(url: string, placeholders) {
    let resultURL = url;
    Object.keys(placeholders).forEach((key => {
      if (!!placeholders[key]) {
        throw Error("Dynamic route is invalid");
      }
      resultURL = resultURL.replace(`{${key}}`, placeholders[key]);
    }));
    return resultURL;
  }
}