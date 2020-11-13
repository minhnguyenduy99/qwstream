import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UseFormData } from "src/helpers/interceptors";
import { ObjectIdFormat, ParamValidationPipe } from "src/helpers/validation";
import { ChannelNotFoundException } from "..";
import { CreateChannelInput, CreateChannelOutPut, UpdateChannelInfoInput, UpdateChannelInfoOutput } from "../dto";
import { ChannelQueryService, FollowQueryService } from "../services";
import { ChannelCommitService } from "../services/service.channel.commit";

@Controller('channel')
export class ChannelController {
    constructor(
        private readonly channelCommitService: ChannelCommitService,
        private readonly channelQueryService: ChannelQueryService
    ) { }

    @Post('create')
    @UseInterceptors(FilesInterceptor('files'))
    async createChannel(@Body() input: CreateChannelInput) {
        const channel = await this.channelCommitService.createChannel(input);
        return {
            cid: channel._id
        } as CreateChannelOutPut
    }

    @Get('find')
    async findChannelByName(@Query("name") name: string, @Query("page") page: number) {
        let channels = await this.channelQueryService.findChannelByName(name, page);
        return channels;
    }

    @Put('update')
    @UseInterceptors(FilesInterceptor('files'))
    async updateChannelInfo(@Body() input: UpdateChannelInfoInput) {
        await this.channelCommitService.updateInfo(input);
        return {
            code: 0
        } as UpdateChannelInfoOutput
    }

    @Put("upload-avatar")
    @UseFormData({ fileField: "avatar" })
    async uploadAvatar(@Query("cid", new ParamValidationPipe(ObjectIdFormat)) cid: string, @UploadedFile() avatar) {
        const res = await this.channelCommitService.updateAvatarFromDevice({ cid: cid, file: avatar });
        return {
            avatar: res,
            code: 0
        }
    }

    @Get(':cid')
    async getChannelByCID(@Param("cid", new ParamValidationPipe(ObjectIdFormat)) cid: string) {
        const channel = await this.channelQueryService.getChannel(cid);
        if (!channel) {
            throw new ChannelNotFoundException();
        }
        return channel;
    }



    //     @Get("/:user_id/:profile_id")  @Param("channel_id", new ParamValidationPipe(ObjectIdFormat)) channel_id: string,
    //   @UsePipes(ParamValidationPipe)
    //   async findUserById(@Param() params: FindUserQuery)
}