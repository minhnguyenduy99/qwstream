import { Controller, Put, Query, UseGuards } from "@nestjs/common";
import { AuthorizeClass } from "src/authorization";
import { AuthorizationGuard } from "src/authorization/guards/authorization-guard";
import { ObjectIdFormat, ParamValidationPipe } from "src/helpers/validation";
import { OnFollowOutput } from "..";
import { FollowCommitService } from "../services";

@Controller('follow')
@AuthorizeClass({ entity: "FollowEntity" })
@UseGuards(AuthorizationGuard())
export class FollowController {
    constructor(
        private readonly followCommitService: FollowCommitService
    ) { };

    @Put('f')
    async onFollow(@Query("cid", new ParamValidationPipe(ObjectIdFormat)) cid: string, @Query("uid", new ParamValidationPipe(ObjectIdFormat)) uid: string) {
        await this.followCommitService.onFollow(cid, uid);
        return {
            code: 0
        } as OnFollowOutput;
    }

    @Put('u')
    async onUnFollow(@Query("cid", new ParamValidationPipe(ObjectIdFormat)) cid: string, @Query("uid", new ParamValidationPipe(ObjectIdFormat)) uid: string) {
        await this.followCommitService.onUnfollow(cid, uid);
        return {
            code: 0
        } as OnFollowOutput;
    }
}