import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserCommitService } from "src/user-management/core";
import { Channel } from "../model";

@Injectable()
export class FollowCommitService {
    constructor(
        @InjectModel(Channel.name) private readonly followModel: Model<Channel>,
        private readonly userCommitService: UserCommitService
    ) { }

    async onFollow(cid: string, uid: string) {
        await this.userCommitService.onFollow(cid, uid);
        return this.followModel.updateOne({ _id: cid }, {
            $push: { followers: uid },
            $inc: { count: 1 }
        })
    }

    async onUnfollow(cid: string, uid: string) {
        await this.userCommitService.onUnfollow(cid, uid);
        return this.followModel.updateOne({ _id: cid }, {
            $pull: { followers: uid },
            $inc: { count: -1 }
        })
    }
}