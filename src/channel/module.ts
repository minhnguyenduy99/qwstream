import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OfficialModule } from "src/authentication/official";
import { AuthorizationModule } from "src/authorization";
import { PaginationModule } from "src/helpers/pagination";
import { ImageStorageModule } from "src/services/image-storage";
import { UserManagementModule } from "src/user-management";
import authorizationConfig from "./authorization.config";
import { FollowController } from "./controller";
import { ChannelController } from "./controller/controller.channel";
import { ChannelEventHandler } from "./eventHandler";
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
        }),
        AuthorizationModule.forFeature({ config: authorizationConfig }),
    ],
    providers: [
        ChannelCommitService, ChannelQueryService, FollowCommitService, FollowQueryService, ChannelEventHandler
    ],
    controllers: [
        ChannelController,
        FollowController
    ]
})

export class ChannelModule {
}