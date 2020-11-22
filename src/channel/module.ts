import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OfficialModule } from "src/authentication/official";
import { PaginationModule } from "src/helpers/pagination";
import { ImageStorageModule } from "src/services/image-storage";
import { UserManagementModule } from "src/user-management";
import { UserCommitService, UserQueryService } from "src/user-management/core";
import { FollowController } from "./controller";
import { ChannelController } from "./controller/controller.channel";
import { Channel, ChannelSchema } from "./model";
import { FollowCommitService, FollowQueryService } from "./services";
import { ChannelCommitService } from "./services/service.channel.commit";
import { ChannelQueryService } from "./services/service.channel.query";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Channel.name, schema: ChannelSchema }
        ]),
        PaginationModule,
        UserManagementModule,
        OfficialModule,
        ImageStorageModule.forFeature({
            albumName: "Channel Avatar"
        })
    ],
    providers: [
        ChannelCommitService, ChannelQueryService, FollowCommitService, FollowQueryService
    ],
    controllers: [
        ChannelController,
        FollowController
    ]
})

export class ChannelModule {
}