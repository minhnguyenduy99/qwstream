import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Channel } from "../model";

@Injectable()
export class FollowQueryService {
    constructor(
        @InjectModel(Channel.name) private readonly channelModel: Model<Channel>
    ) { }

    async getFollowByChannelID(cid: string) {
        
    }

    async getFollowCount(cid: string) {
        // const count = await this.followModel.findOne({ cid: cid }, { followers: false });
        // return count.count;
    }
}