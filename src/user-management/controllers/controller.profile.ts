import { Body, Controller, Get, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express/multer/interceptors";
import { UseFormData } from "src/helpers/interceptors";
import { ObjectIdFormat, ParamValidationPipe } from "src/helpers/validation";
import { FindProfileInput, FindProfileOutput, ProfileCommitService, ProfileQueryService, UpdateProfileInput, UpdateProfileOutput } from "../core";

@Controller("user/profile")
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
    @UseInterceptors(FilesInterceptor('files'))
    async updateProfile(@Body() input: UpdateProfileInput) {
        await this.profileCommitService.updateProfile(input);
        return {
            code: 0
        } as UpdateProfileOutput
    }

    @Put("upload-avatar")
    @UseFormData({ fileField: "avatar" })
    async uploadAvatar(@Query("uid", new ParamValidationPipe(ObjectIdFormat)) uid: string, @UploadedFile() avatar) {
        const res = await this.profileCommitService.updateAvatarFromDevice({ uid: uid, file: avatar });
        return {
            avatar: res, 
            code: 0
        } as UpdateProfileOutput
    }
}