import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ImageStorageCodes, ImageStorageService } from "src/services/image-storage";
import { ProfileQueryService } from "src/user-management/core";
import { ChannelUploadAvatarException } from "..";
import { CreateChannelInput, UpdateChannelInfoInput, UploadAvatarInput } from "../dto";
import { Channel } from "../model";

@Injectable()
export class ChannelCommitService {
    constructor(
        @InjectModel(Channel.name) private readonly channelModel: Model<Channel>,
        private readonly profileQueryService: ProfileQueryService,
        private readonly imageStorageService: ImageStorageService
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
        delete update["count"];
        delete update["followers"];
        return this.channelModel.updateOne({ _id: cid }, update)
    }

    async updateAvatarFromDevice(input: UploadAvatarInput) {
        if (input.file === undefined){
            throw new ChannelUploadAvatarException("File not found!")
        }
        const res = await this.imageStorageService.uploadImage({ file: input.file });
        if (res.code === ImageStorageCodes.UPLOAD_IMAGE_FAILED) {
            throw new ChannelUploadAvatarException();
        }
        await this.updateInfo({
            cid: input.cid,
            avatar: res.data.url
        } as UpdateChannelInfoInput)
        return res.data
    }
}