import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Channel } from "../model";

@Injectable()
export class FollowCommitService {
    constructor(
        @InjectModel(Channel.name) private readonly followModel: Model<Channel>
    ) { }

    async onFollow(cid: string, uid: string) {
        await this.followModel.updateOne({ cid: cid }, { $push: { followers: uid } })
    }

    async onUnfollow(cid: string, uid: string) {
        await this.followModel.updateOne({ cid: cid }, { $pull: { followers: uid } })
    }
}