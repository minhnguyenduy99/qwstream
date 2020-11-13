import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserQueryService } from "src/user-management/core";
import { Channel } from "../model";

@Injectable()
export class FollowQueryService {
    constructor(
        @InjectModel(Channel.name) private readonly channelModel: Model<Channel>,
        private readonly userQueryService: UserQueryService
    ) { }

    async isFollow(cid: string, uid: string) {
        return this.userQueryService.isFollow(cid, uid);
    }
}