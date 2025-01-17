import { Body, Controller, Get, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express/multer/interceptors";
import { AuthorizeClass, AuthorizeMethod } from "src/authorization";
import { ActionType } from "src/authorization/consts";
import { AuthorizationGuard } from "src/authorization/guards/authorization-guard";
import { UseFormData } from "src/helpers/interceptors";
import { ObjectIdFormat, ParamValidationPipe } from "src/helpers/validation";
import { FindProfileOutput, ProfileCommitService, ProfileQueryService, UpdateProfileInput, UpdateProfileOutput } from "../core";

@Controller("user/profile")
@AuthorizeClass({ entity: "ProfileEntity" })
@UseGuards(AuthorizationGuard())
export class ProfileController {
    constructor(
        private readonly profileCommitService: ProfileCommitService,
        private readonly profileQueryService: ProfileQueryService
    ) { }

    @Get()
    async findProfile(@Query("uid", new ParamValidationPipe(ObjectIdFormat)) uid: string) {
        const profile = await this.profileQueryService.findProfile(uid);
        return {
            nickname: profile.nickname,
            day_of_birth: profile.date_of_birth,
            gender: profile.gender
        } as FindProfileOutput;
    }

    @Put("update")
    @AuthorizeMethod({
        type: ActionType.resource
    })
    @UseInterceptors(FilesInterceptor('files'))
    async updateProfile(@Body() input: UpdateProfileInput) {
        await this.profileCommitService.updateProfile(input);
        return {
            code: 0
        } as UpdateProfileOutput
    }

    @Put("upload-avatar")
    @AuthorizeMethod({
        type: ActionType.resource,
        resourceHandler: req => req.query.uid
    })
    @UseFormData({ fileField: "avatar" })
    async uploadAvatar(@Query("uid", new ParamValidationPipe(ObjectIdFormat)) uid: string, @UploadedFile() avatar) {
        const res = await this.profileCommitService.updateAvatarFromDevice({ uid: uid, file: avatar });
        return {
            avatar: res,
            code: 0
        } as UpdateProfileOutput
    }
}