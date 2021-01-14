import { Get, Param, Body, Query, Controller, Post, UploadedFile, UseInterceptors, ParseIntPipe, Logger, Inject, Put } from "@nestjs/common";
import { UseFormData } from "@helpers/interceptors";
import { ParsePagePipe } from "@helpers/pagination";
import { ParamValidationPipe, ObjectIdFormat } from "@helpers/validation";
import { ChannelStreamViewService, CreateStreamInput, GetChannelOldStreamingInput, UpdateStreamInput } from "../services";
import { StreamInitService } from "../services";
import { NginxAuthFactory, StreamAuth, StreamAuthInterceptor, StreamAuthService } from "../stream-auth";
import { InvalidStreamKeyInception, StreamNotExistException } from "../errors";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { STREAM_EVENTS } from "../consts";
import { KEYS } from "../config";
import { StreamStatsService } from "../stream-stats";

@Controller("stream")
export class ChannelStreamViewController {

    
    constructor(
        private readonly channelStreamingView: ChannelStreamViewService,
        private readonly streamInitService: StreamInitService,
        private readonly streamKeyService: StreamAuthService,
        private readonly streamStatsService: StreamStatsService,
        private readonly eventEmitter: EventEmitter2,
        @Inject(KEYS.LOGGER) private readonly logger: Logger
    ) {

    }

    @Post("auth")
    @UseInterceptors(new StreamAuthInterceptor(NginxAuthFactory))
    async authStreamKeyByNGINX(
        @Body() input: StreamAuth) 
    {
        const { stream_id, key } = input;
        const result = await this.streamKeyService.vertifyStreamKey(key, stream_id);
        console.log(input)
        console.log(result)
        if (result.code !== 0) {
            throw new InvalidStreamKeyInception(result.message);
        }
        const hlsStreamURL = await this.streamInitService.updateHLSStreamURL(stream_id, key);
        // Create stream stats 
        await this.streamStatsService.createStats(stream_id, { 
            view_count_denta: 0,
            hls_stream_url: hlsStreamURL 
        });
        this.logger.debug(`[${this.authStreamKeyByNGINX.name}] Stream ID: ${input.stream_id}`);
        this.eventEmitter.emitAsync(STREAM_EVENTS.STREAM_ESTABLISHED, { stream_id });
        return result;
    }

    @Get("auth/:stream_id")
    async generateNewStreamKeyURL(
        @Param("stream_id", new ParamValidationPipe(ObjectIdFormat)) stream_id: string) 
    {
        const exist = await this.channelStreamingView.doesStreamExist(stream_id);
        if (!exist) {
            throw new StreamNotExistException();
        }
        return this.streamKeyService.generateStreamKey(stream_id);
    }

    @Post(":channel_id")
    @UseFormData({
        fileField: "thumbnail_file",
        jsonFields: ["tags"]
    })
    async createStream(
        @Param("channel_id", new ParamValidationPipe(ObjectIdFormat)) channel_id: string, 
        @UploadedFile() file,
        @Body() input: CreateStreamInput) 
    {
        input.thumbnail_file = file;
        const result = await this.streamInitService.createStream(channel_id, input);
        const streamKey = await this.streamKeyService.generateStreamKey(result.stream._id);
        result["stream_key"] = streamKey;
        return result;
    }

    @Put(":channel_id")
    @UseFormData({
        fileField: "thumbnail_file",
        jsonFields: ["tags"]
    })
    async updateStream(
        @Param("channel_id", new ParamValidationPipe(ObjectIdFormat)) channel_id: string, 
        @UploadedFile() file,
        @Body() input: UpdateStreamInput) 
    {
        input.thumbnail_file = file;
        const result = await this.streamInitService.updateCurrentStream(channel_id, input);
        return result;
    }

    @Get(":channel_id/videos")
    async getChannelOldStreamingVideos(
        @Param("channel_id", new ParamValidationPipe(ObjectIdFormat)) channel_id: string,
        @Query("page", new ParsePagePipe()) page: number,
        @Body() input: GetChannelOldStreamingInput
    ) {
        return this.channelStreamingView.getChannelOldStreamingVideos(channel_id, page, input);
    }

    @Get(":channel_id/current")
    async getCurrentStreamingInfo(
        @Param("channel_id", new ParamValidationPipe(ObjectIdFormat)) channel_id: string,
        @Query("latest", ParseIntPipe) latest: number
    ) {
        return this.channelStreamingView.getCurrentStreamInfoByChannel(channel_id, latest);
    }
}