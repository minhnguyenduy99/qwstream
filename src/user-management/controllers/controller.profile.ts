import { Body, Controller, Get, Put, Query, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express/multer/interceptors";
import { FindProfileInput, FindProfileOutput, ProfileCommitService, ProfileQueryService, UpdateProfileInput, UpdateProfileOutput } from "../core";

@Controller("user/profile")
export class ProfileController {
    constructor(
        private readonly profileCommitService: ProfileCommitService,
        private readonly profileQueryService: ProfileQueryService
    ) { }

    @Get()
    async findProfile(@Query("uid") uid: string) {
        const profile = await this.profileQueryService.findProfile(uid);
        return {
            pid: profile._id,
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
}