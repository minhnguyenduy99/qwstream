import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ObjectIdFormat, ParamValidationPipe } from "src/helpers/validation";
import { CreateChannelOutPut } from "../dto";
import { ChannelQueryService } from "../services";
import { ChannelCommitService } from "../services/service.channel.commit";

@Controller('channel')
export class ChannelController {
    constructor(
        private readonly channelCommitService: ChannelCommitService,
        private readonly channelQueryService: ChannelQueryService
    ) { }

    @Post('create')
    async createChannel(@Query("uid") uid: string) {
        const channel = await this.channelCommitService.createChannel(uid);
        return {
            cid: channel._id
        } as CreateChannelOutPut
    }

    @Get(':cid')
    async getChannelByCID(@Param("cid", new ParamValidationPipe(ObjectIdFormat)) cid: string){
        const channel = this.channelQueryService.getChannel(cid);
        return channel;
    }

//     @Get("/:user_id/:profile_id")  @Param("channel_id", new ParamValidationPipe(ObjectIdFormat)) channel_id: string,
//   @UsePipes(ParamValidationPipe)
//   async findUserById(@Param() params: FindUserQuery)
}