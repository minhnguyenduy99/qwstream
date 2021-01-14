import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IResultLimiter, PaginatorFactory } from "@helpers/pagination";
import { KEYS, PaginationConfig } from "../config";
import { 
    StreamInfoDTO,
    ChannelCurrenttStreamingOutput, 
    GetChannelOldStreamingInput, GetChannelOldStreamingOutput 
} from "./dto";
import { StreamInfo } from "../models";


@Injectable()
export class ChannelStreamViewService {

    protected limiter: IResultLimiter;
    private readonly DEFAULT_LIMIT_QUERY_SIZE = 6;

    constructor(
        @InjectModel(StreamInfo.name) private readonly streamInfoModel: Model<StreamInfo>,
        private readonly paginatorFactory: PaginatorFactory,
        @Inject(KEYS.PAGINATION) pagination: PaginationConfig
    ) {
        this.limiter = this.paginatorFactory.createLimiter({
            requestURL: pagination.channelStreamPaginationURL,
            limit: this.DEFAULT_LIMIT_QUERY_SIZE,
            limitQueryParam: "page"
        })
    }

    async doesStreamExist(stream_id: string, isLive = true) {
        const stream = await this.streamInfoModel.findOne({
            _id: stream_id,
            is_streaming: isLive
        }, {
            stream_id: 1
        });
        if (stream) {
            return true;
        }
        return false;
    }

    async getCurrentStreamInfoByChannel(channelId: string, latest = 0): Promise<ChannelCurrenttStreamingOutput> {
        const streamInfo = await this.streamInfoModel.findOne({
            "channel.channel_id": channelId
        }).sort({ stream_time_start: -1 });
        if (!streamInfo) {
            return {
                is_streaming: false,
                ...(latest && { lastest: null }),
                current: null
            };
        }
        const streamObj = streamInfo.toObject() as StreamInfoDTO;
        if (!latest) {
            return {
                is_streaming: streamObj.is_streaming,
                current: streamObj.is_streaming ? streamObj : null
            };
        }
        let latestStream = null, current = null;
        if (streamInfo.is_streaming) {
            current = streamObj;
        } else {
            latestStream = streamObj;
        }
        return {
            is_streaming: streamInfo.is_streaming,
            latest: latestStream,
            current
        };
    }

    async getChannelOldStreamingVideos(channelId: string, page = 1, { sortByTime = -1, sortByViews = -1 }: GetChannelOldStreamingInput) {
        const { next, results } = await this.limiter.query(this.streamInfoModel, {
            page,
            aggregates: [
                {
                    $match: {
                        "channel.channel_id": channelId
                    }
                },
                {
                    $sort: {
                        stream_time_start: sortByTime,
                        view_count: sortByViews
                    }
                }
            ]
        });
        this.streamInfoModel.find({
            stream_title: {
                $regex: `/.*m/.*`
            }
        })
        return {
            results: results.map(result => result.toObject() as StreamInfoDTO),
            next: next,
            count: results.length
        } as GetChannelOldStreamingOutput;
    }
}