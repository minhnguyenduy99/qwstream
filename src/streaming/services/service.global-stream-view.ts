import { Inject, Injectable } from "@nestjs/common";
import { IResultLimiter, PaginatorFactory } from "@helpers/pagination";
import { StreamInfo } from "../models";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { StreamSearchInput, StreamSearchOutput, CurrentStreamSearchOutput, StreamInfoDTO } from "./dto";
import { KEYS, PaginationConfig } from "../config";


@Injectable()
export class GlobalStreamViewService {

    protected limiter: IResultLimiter;
    private readonly DEFAULT_LIMIT_QUERY_SIZE = 6;

    constructor(
        @InjectModel(StreamInfo.name) private readonly streamInfoModel: Model<StreamInfo>,
        private readonly paginatorFactory: PaginatorFactory,
        @Inject(KEYS.PAGINATION) paginationConfig: PaginationConfig
    ) {
        this.limiter = this.paginatorFactory.createLimiter({
            requestURL: paginationConfig.globalStreamPaginationURL,
            limit: this.DEFAULT_LIMIT_QUERY_SIZE,
            limitQueryParam: "page"
        })
    }

    async searchGlobalStreamingInfo(page = 1, searchInput: StreamSearchInput) {
        let results = [];
        if (searchInput.search_for_current) {
            results = await Promise.all([
                this.getGlobalOldStreamingInfo(page, searchInput),
                this.getListGlobalCurrentStreamingInfo(page, searchInput)
            ])
        } else {
            results = await Promise.all([
                this.getGlobalOldStreamingInfo(page, searchInput)
            ])
        }
        return {
            search: searchInput.search_value,
            old: results[0],
            current: searchInput.search_for_current ? results[1] : null
        } as StreamSearchOutput;
    }

    async getListGlobalCurrentStreamingInfo(page = 1, { category_id = null, search_value = "" }: StreamSearchInput) {
        const results = await this.limiter.query(this.streamInfoModel, {
            page,
            aggregates: [
                {
                    $match: {
                        $text: { $search: search_value }
                    }
                },
                {
                    $match: {
                        is_streaming: true,
                        category_id: category_id
                    }
                },
            ]
        });
        return {
            count: results.results.length,
            next: results.next,
            results: results.results.map(streamInfo => ({
                ...streamInfo.toObject(),
                thumbnail_url: null
            }))
        } as CurrentStreamSearchOutput;
    }

    async getGlobalOldStreamingInfo(page = 1, { category_id = null, search_value = null }: StreamSearchInput) {
        const results = await this.limiter.query(this.streamInfoModel, {
            page,
            aggregates: [
                {
                    $match: {
                        $text: { $search: search_value }
                    }
                },
                {
                    $match: {
                        is_streaming: false,
                        category_id: category_id
                    }
                }
            ],
            additionQuery: {
                name: search_value
            }
        });
        return {
            count: results.results.length,
            next: results.next,
            results: (results.results as unknown) as StreamInfoDTO[]
        } as CurrentStreamSearchOutput;
    }
}