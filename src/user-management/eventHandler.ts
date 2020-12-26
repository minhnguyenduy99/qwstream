import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { AuthorizationService } from "src/authorization";
import { role } from "src/role.config";
import { constants } from "./const";

@Injectable()
export class UserEventHandler {
    constructor(
        private readonly authorization: AuthorizationService,
    ) { }

    @OnEvent(constants.onUserCreate, { async: true })
    async onUserCreate(user) {
        this.authorization.createPrincipal({
            principal_id: user.id,
            role_name: role.user,
            self_added: true
        });
    }
}