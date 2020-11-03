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
        return this.followModel.updateOne({ cid: cid }, {
            $push: { followers: uid },
            $inc: { count: 1 }
        })
    }

    async onUnfollow(cid: string, uid: string) {
        return this.followModel.updateOne({ cid: cid }, {
            $pull: { followers: uid },
            $inc: { count: -1 }
        })
    }
}