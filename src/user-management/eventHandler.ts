import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AuthorizationService } from "src/authorization";
import { constants as channelConst } from "src/channel/const";
import { role } from "src/role.config";
import { constants as userConst } from "./const";
import { UserCommitService } from "./core";

@Injectable()
export class UserEventHandler {
    constructor(
        private readonly authorization: AuthorizationService,
        private readonly userCommitService: UserCommitService
    ) { }

    @OnEvent(userConst.onUserCreate, { async: true })
    async onUserCreate(user) {
        this.authorization.createPrincipal({
            principal_id: user.id,
            role_name: role.user,
            self_added: true
        });
    }

    @OnEvent(channelConst.onChannelCreate, { async: true })
    async onChannelCreate(channel) {
        this.userCommitService.onChannelCreate(channel);
    }

    @OnEvent(channelConst.onChannelCreate, { async: true })
    async onChannelDelete(channel) {
        this.userCommitService.onChannelDelete(channel);
    }
}