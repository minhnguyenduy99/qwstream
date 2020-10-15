import { Injectable } from "@nestjs/common";
import Paginator from "./paginator/paginator";
import { IPaginator, PaginationConstruct } from "./paginator/pagination.interfaces";
import ResultLimiter from "./limiter/ResultLimiter";
import { IResultLimiter, ResultLimiterConstruct } from "./limiter/result-limiter.interfaces";

@Injectable()
export default class PaginatorFactory {

  createPaginator(options: PaginationConstruct): IPaginator {
    return new Paginator(options);
  }

  createLimiter(options: ResultLimiterConstruct): IResultLimiter {
    return new ResultLimiter(options);
  }
}