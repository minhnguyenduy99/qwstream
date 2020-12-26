import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AuthorizationService } from "src/authorization";
import { role } from "src/role.config";
import { constants } from "./const";

@Injectable()
export class ChannelEventHandler {
    constructor(
        private readonly authorization: AuthorizationService,
    ) { }

    @OnEvent(constants.onChannelCreate, { async: true })
    async onUserCreate(channel) {
        this.authorization.createPrincipal({
            principal_id: channel.id,
            role_name: role.channel,
            self_added: true
        });
    }
}