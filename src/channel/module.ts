import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PaginationModule } from "src/helpers/pagination";
import { UserManagementModule } from "src/user-management";
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