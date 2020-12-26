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
        const [, ret] = await Promise.all(
            [
                this.userCommitService.onFollow(cid, uid),
                this.followModel.updateOne({ _id: cid }, {
                    $push: { followers: uid },
                    $inc: { count: 1 }
                })
            ]
        )
        return ret;
    }

    async onUnfollow(cid: string, uid: string) {
        const [, ret] = await Promise.all([
            this.userCommitService.onUnfollow(cid, uid),
            this.followModel.updateOne({ _id: cid }, {
                $pull: { followers: uid },
                $inc: { count: -1 }
            })
        ])
        return ret;
    }
}