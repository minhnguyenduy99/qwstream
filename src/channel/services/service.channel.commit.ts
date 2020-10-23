import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProfileQueryService } from "src/user-management/core";
import { UpdateChannelInfoInput } from "../dto";
import { Channel } from "../model";

@Injectable()
export class ChannelCommitService {
    constructor(
        @InjectModel(Channel.name) private readonly channelModel: Model<Channel>,
        private readonly profileQueryService: ProfileQueryService
    ) { }

    async createChannel(uid: string) {
        const profile = await this.profileQueryService.findProfile(uid);
        let channel = new this.channelModel({
            uid: uid
        });
        channel.name = profile.nickname;
        return channel.save();
    }

    async deleteChannel(cid: string) {
        await this.channelModel.deleteOne({ _id: cid });
    }

    async updateInfo(update: UpdateChannelInfoInput) {
        const cid = update.cid;
        delete update.cid;
        await this.channelModel.updateOne({ _id: cid }, update)
    }
}