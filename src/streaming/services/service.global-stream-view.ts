import { Inject, Injectable } from "@nestjs/common";
import { IResultLimiter, PaginatorFactory } from "@helpers/pagination";
import { StreamCategory, StreamInfo } from "../models";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { AggregateBuilder } from "src/helpers/mongodb-helpers";
import { StreamSearchInput, StreamSearchOutput, CurrentStreamSearchOutput, StreamInfoDTO, StreamWithSortedInput, StreamPaginationOutput } from "./dto";
import { KEYS, PaginationConfig } from "../config";

@Injectable()
export class GlobalStreamViewService {

    protected limiter: IResultLimiter;
    private readonly DEFAULT_LIMIT_QUERY_SIZE = 3;

    constructor(
        @InjectModel(StreamInfo.name) private readonly streamInfoModel: Model<StreamInfo>,
        @InjectModel(StreamCategory.name) private readonly streamCategoryModel: Model<StreamCategory>,
        private readonly paginatorFactory: PaginatorFactory,
        @Inject(KEYS.PAGINATION) paginationConfig: PaginationConfig
    ) {
        this.limiter = this.paginatorFactory.createLimiter({
            requestURL: paginationConfig.globalStreamPaginationURL,
            limit: this.DEFAULT_LIMIT_QUERY_SIZE,
            limitQueryParam: "page"
        })
    }

    async getStreamById(streamId: string): Promise<StreamInfoDTO> {
        const stream = await this.streamInfoModel.findOne({
            _id: streamId
        }, {
            __v: 0
        }).populate("stream_category", "-id -_id -__v");
        if (!stream) {
            return null;
        }
        const streamDTO = stream.toObject({ virtuals: true });
        streamDTO.category = { ...streamDTO.stream_category };
        delete streamDTO.stream_category;
        return streamDTO;
    }

    async sortAndPaginateStreams(page: number, sorter: StreamWithSortedInput): Promise<StreamPaginationOutput> {
        const {
            sortByTime,
            sortByView,
            type
        } = sorter;
        const paginatedResult = await this.limiter.query(this.streamInfoModel, {
            page,
            aggregates: this.constructSortAggregates(sorter),
            additionQuery: {
                ...(sortByTime && { "sort-by-time": sortByTime }),
                ...(sortByView && { "sort-by-view": sortByView }),
                ...(type && { type })
            }
        });
        return {
            count: paginatedResult.results.length,
            next: paginatedResult.next,
            results: paginatedResult.results as any[]
        }
    }

    async getStreamsByCategory(categoryId: number, page = 1): Promise<StreamPaginationOutput> {
        const aggregateBuilder = new AggregateBuilder();
        const category = await this.streamCategoryModel.findOne({
            category_id: categoryId
        });
        const paginatedResult = await this.limiter.query(this.streamInfoModel, {
            page,
            aggregates: aggregateBuilder
            .match({
                category: categoryId
            })
            .lookup({
                from: this.streamCategoryModel,
                localField: "category",
                foreignField: "category_id",
                as: "categories",
                removeFields: ["__v", "_id"]
            })
            .removeFields(["__v"])
            .build()
        });
        return {
            count: paginatedResult.results.length,
            next: paginatedResult.next,
            results: paginatedResult.results as any[],
            search: {
                category_id: categoryId,
                category_name: category.category_name
            }
        }
    }

    async getGlobalStreamingInfo(page = 1, searchInput: StreamSearchInput) {
        let results = [];
        if (searchInput.type) {
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
            current: searchInput.type ? results[1] : null
        } as StreamSearchOutput;
    }

    async getListGlobalCurrentStreamingInfo(page = 1, { category_id = null, search_value = "" }: StreamSearchInput) {
        const splitValues = search_value.split(" ");
        const results = await this.constructSearchQuery({
            page,
            is_streaming: true,
            tags: splitValues,
            search: search_value,
            category_id
        });
        return {
            count: results.results.length,
            next: results.next,
            results: results.results as any[]
        } as CurrentStreamSearchOutput;
    }

    async getGlobalOldStreamingInfo(page = 1, { category_id = null, search_value = "" }: StreamSearchInput) {
        const splitValues = search_value.split(" ");
        const results = await this.constructSearchQuery({
            page,
            is_streaming: false,
            tags: splitValues,
            search: search_value,
            category_id
        });
        return {
            count: results.results.length,
            next: results.next,
            results: (results.results as unknown) as StreamInfoDTO[]
        } as CurrentStreamSearchOutput;
    }

    protected async constructSearchQuery({ page, is_streaming, search, tags, category_id }) {
        const aggregateBuilder = new AggregateBuilder();
        const results = await this.limiter.query(this.streamInfoModel, {
            page,
            aggregates: aggregateBuilder
            .match({
                $or: [
                    { $text: { $search: search } },
                    { tags: { $in: tags } }
                ]
            })
            .match({
                is_streaming,
                ...(category_id && { category: category_id })
            })
            .lookup({
                from: this.streamCategoryModel,
                localField: "category",
                foreignField: "category_id",
                as: "categories",
                removeFields: ["__v", "_id"]
            })
            .removeFields(["__v"])
            .build(),
            additionQuery: {
                ...(search && { value: search }),
                ...(category_id && { category_id }),
                current: 1
            }
        });

        return results;
    }

    protected constructSortAggregates(sorter: StreamWithSortedInput) {
        const aggregateBuilder = new AggregateBuilder();
        const { 
            sortByView,
            sortByTime,
            type
        } = sorter;
        if (type) {
            aggregateBuilder.match({
                is_streaming: type === "current" ? true : false  
            })
        }
        aggregateBuilder
        .lookup({
            from: this.streamCategoryModel,
            localField: "category",
            foreignField: "category_id",
            as: "categories",
            removeFields: ["__v", "_id"]
        })
        .sort({
            ...(sortByTime && { stream_time_start: sortByTime }),
            ...(sortByView && { view_count: sortByView }),
        })
        .removeFields(["__v", "categories"])
        return aggregateBuilder.build();
    }
}