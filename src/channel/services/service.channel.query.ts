import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IResultLimiter, PaginatorFactory } from "src/helpers/pagination";
import { Channel } from "../model";

@Injectable()
export class ChannelQueryService {
    protected limiter: IResultLimiter;
    private DEFAULT_LIMIT_QUERY_SIZE = 20;

    constructor(
        @InjectModel(Channel.name) private readonly channelModel: Model<Channel>,
        private readonly paginatorFactory: PaginatorFactory,
    ) {
        this.limiter = this.paginatorFactory.createLimiter({
            requestURL: `http://localhost:3000/channel`,
            limit: this.DEFAULT_LIMIT_QUERY_SIZE,
            limitQueryParam: "page"
        })
    }

    async getChannel(cid: string) {
        return this.channelModel.findById(cid, { followers: false, _id: false });
    }

    async findChannelByName(name: string, page = 1) {
        return this.limiter.query(this.channelModel, {
            page: page,
            aggregates: [
                {
                    $match: {
                        $text: { $search: name }
                    }
                }
            ]
        })
        // this.channelModel.find({ $text: { $search: name } });
    }
}