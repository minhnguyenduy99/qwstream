import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProfileQueryService } from "src/user-management/core";
import { CreateChannelInput, UpdateChannelInfoInput } from "../dto";
import { Channel } from "../model";

@Injectable()
export class ChannelCommitService {
    constructor(
        @InjectModel(Channel.name) private readonly channelModel: Model<Channel>,
        private readonly profileQueryService: ProfileQueryService
    ) { }

    async createChannel(input: CreateChannelInput) {
        const profile = await this.profileQueryService.findProfile(input.uid);
        let channel = new this.channelModel(input);
        channel.name = input.name || profile.nickname;
        return channel.save();
    }

    async deleteChannel(cid: string) {
        return this.channelModel.deleteOne({ _id: cid });
    }

    async updateInfo(update: UpdateChannelInfoInput) {
        const cid = update.cid;
        delete update.cid;
        return this.channelModel.updateOne({ _id: cid }, update)
    }
}