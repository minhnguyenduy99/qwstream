import { Body, Controller, Get, Param, Post, Query, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ObjectIdFormat, ParamValidationPipe } from "src/helpers/validation";
import { CreateChannelInput, CreateChannelOutPut } from "../dto";
import { ChannelQueryService } from "../services";
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
        const channels = await this.channelQueryService.findChannelByName(name, page);
        return channels;
    }

    @Get(':cid')
    async getChannelByCID(@Param("cid", new ParamValidationPipe(ObjectIdFormat)) cid: string) {
        const channel = await this.channelQueryService.getChannel(cid);
        return channel;
    }



    //     @Get("/:user_id/:profile_id")  @Param("channel_id", new ParamValidationPipe(ObjectIdFormat)) channel_id: string,
    //   @UsePipes(ParamValidationPipe)
    //   async findUserById(@Param() params: FindUserQuery)
}