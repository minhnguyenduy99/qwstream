import { Param } from "@nestjs/common";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { STREAM_EVENTS } from "../consts";
import { StreamInitService } from "../services";
import { StreamStatsService, STREAM_STATS_CODES } from "../stream-stats";



@Controller("tests/stream-stats")
export class StreamStatsController {


    constructor(
        private readonly streamStatsService: StreamStatsService,
        private readonly streamInitService: StreamInitService,
        private readonly eventEmitter: EventEmitter2
    ) {}

    @Post()
    async createStats(@Body() { stream_id, key }) {
        const hlsUrl = await this.streamInitService.updateHLSStreamURL(key, stream_id);
        const result = await this.streamStatsService.createStats(stream_id, { view_count_denta: 0, hls_stream_url: hlsUrl });
        this.eventEmitter.emitAsync(STREAM_EVENTS.STREAM_ESTABLISHED, stream_id);
        return result;
    }

    @Get("/:stream_id")
    getStats(@Param("stream_id") streamId: string) {
        return this.streamStatsService.getStats(streamId);
    } 
}